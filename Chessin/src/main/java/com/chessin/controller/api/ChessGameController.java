package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.requests.*;
import com.chessin.controller.responses.BoardResponse;
import com.chessin.controller.responses.ChessGameResponse;
import com.chessin.model.playing.*;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.register.configuration.JwtService;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.utils.Constants;
import com.chessin.model.utils.HelpMethods;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
public class ChessGameController {
    private final ChessGameRepository chessGameRepository;
    private final ChessGameService chessGameService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final ClassicalRatingRepository classicalRatingRepository;
    private final RapidRatingRepository rapidRatingRepository;
    private final BlitzRatingRepository blitzRatingRepository;
    private final BulletRatingRepository bulletRatingRepository;

    private final ConcurrentHashMap<String, PendingChessGame> pendingGames = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Board> activeBoards = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, ChessGame> activeGames = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, GameInvitation> pendingInvitations = new ConcurrentHashMap<>();

    @Transactional
    @PostMapping("/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request, HttpServletRequest servlet) throws InterruptedException {

        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(pendingGames.containsKey(email))
        {
            return ResponseEntity.badRequest().body("User is already searching for a game.");
        }

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email)))
        {
            return ResponseEntity.badRequest().body("User is already playing a game.");
        }

        PendingChessGame foundGame = chessGameService.searchNewGame(request, new ArrayList<>(pendingGames.values()));

        if(foundGame != null)
        {
            synchronized(pendingGames.get(foundGame.getUser().getEmail()))
            {
                pendingGames.get(foundGame.getUser().getEmail()).setOpponent(userRepository.findByEmail(email).get());

                int whitePlayerIndex = ThreadLocalRandom.current().nextInt(2);
                int blackPlayerIndex = whitePlayerIndex == 0 ? 1 : 0;

                List<User> players = Arrays.asList(foundGame.getUser(), userRepository.findByEmail(email).get());

                ChessGame game = ChessGame.builder()
                        .startBoard(Constants.Boards.classicBoard)
                        .whiteStarts(true)
                        .whiteUser(players.get(whitePlayerIndex))
                        .blackUser(players.get(blackPlayerIndex))
                        .availableCastles(new int[]{0, 0, 0, 0})
                        .timeControl(foundGame.getTimeControl())
                        .increment(foundGame.getIncrement())
                        .gameType(HelpMethods.getGameType(foundGame.getTimeControl()))
                        .startTime(Instant.now().toEpochMilli())
                        .isRated(foundGame.isRated())
                        .build();

                chessGameRepository.save(game);

                pendingGames.get(foundGame.getUser().getEmail()).setId(game.getId());

                activeBoards.put(game.getId(), Board.fromGame(game));
                activeGames.put(game.getId(), game);

                pendingGames.get(foundGame.getUser().getEmail()).notifyAll();

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
            }
        }

        PendingChessGame pendingChessGame = PendingChessGame.builder()
                .user(userRepository.findByEmail(email).get())
                .timeControl(request.getTimeControl())
                .increment(request.getIncrement())
                .bottomRating(request.getBottomRating())
                .topRating(request.getTopRating())
                .userRating(request.getUserRating())
                .isRated(request.isRated())
                .build();

        pendingGames.put(email, pendingChessGame);

        synchronized (pendingGames.get(pendingChessGame.getUser().getEmail())) {
            pendingGames.get(pendingChessGame.getUser().getEmail()).wait(Constants.Application.gameSearchTime);
        }

        synchronized (pendingGames.get(pendingChessGame.getUser().getEmail())) {
            if (pendingGames.get(pendingChessGame.getUser().getEmail()).getOpponent() == null) {
                pendingGames.remove(pendingChessGame.getUser().getEmail());
                return ResponseEntity.badRequest().body("No opponent found");
            }
            else
            {
                pendingGames.get(pendingChessGame.getUser().getEmail()).wait(Constants.Application.timeout);

                pendingGames.remove(pendingChessGame.getUser().getEmail());

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(pendingChessGame.getId()), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
            }
        }
    }

    @PostMapping("/cancelSearch")
    public ResponseEntity<?> cancelSearch(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body("User not found");

        if(pendingGames.get(email) != null)
            pendingGames.remove(email);
        else
            return ResponseEntity.badRequest().body("No search found");

        return ResponseEntity.ok().body("Search cancelled");
    }

    @PostMapping("/listenForMove")
    public ResponseEntity<?> listenForMove(@RequestBody ListenForMoveRequest request) throws InterruptedException {
        if(!activeGames.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body("Game not found");

        if(!chessGameService.validateMoves(request.getMoves(), activeBoards.get(request.getGameId())))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameService.calculateTime(activeBoards.get(request.getGameId()))));

        synchronized(activeGames.get(request.getGameId()))
        {
            activeGames.get(request.getGameId()).wait(Constants.Application.waitForMoveTime);
            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    @PostMapping("/listenForFirstMove/{gameId}")
    public ResponseEntity<?> listenForFirstMove(@PathVariable String gameId) throws InterruptedException {
        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body("Invalid game id");
        }

        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body("Game not found.");

        if(activeBoards.get(id).getMoves().size() > 0)
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameService.calculateTime(activeBoards.get(id))));

        synchronized(activeGames.get(id))
        {
            activeGames.get(id).wait(Constants.Application.waitForMoveTime);

            if(activeBoards.get(id).getMoves() == null || activeBoards.get(id).getMoves().size() == 0)
            {
                Board endBoard = activeBoards.get(id);
                endBoard.setGameResult(GameResults.ABANDONED);
                activeBoards.remove(id);
                activeGames.remove(id);
                chessGameRepository.updateGameResult(id, GameResults.ABANDONED);
                return ResponseEntity.ok().body(BoardResponse.fromBoard(endBoard));
            }

            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
        }
    }

    @PostMapping("/submitMove")
    @Transactional
    public ResponseEntity<?> submitMove(@RequestBody SubmitMoveRequest request, HttpServletRequest servlet) throws InterruptedException {
        if(!activeBoards.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body("Game not found.");

        synchronized(activeGames.get(request.getGameId()))
        {
            String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

            Board board = activeBoards.get(request.getGameId());

            if(request.isDoesResign())
            {
                if(board.getWhiteEmail().equals(email))
                {
                    board.setGameResult(GameResults.WHITE_RESIGN);
                    activeBoards.replace(request.getGameId(), board);
                    if(activeGames.get(request.getGameId()).isRated())
                        activeBoards.replace(request.getGameId(), chessGameService.updateRatings(activeGames.get(request.getGameId()), activeBoards.get(request.getGameId())));
                    activeGames.get(request.getGameId()).notifyAll();
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(board));
                }
                else if(board.getBlackEmail().equals(email))
                {
                    board.setGameResult(GameResults.BLACK_RESIGN);
                    activeBoards.replace(request.getGameId(), board);
                    if(activeGames.get(request.getGameId()).isRated())
                        activeBoards.replace(request.getGameId(), chessGameService.updateRatings(activeGames.get(request.getGameId()), activeBoards.get(request.getGameId())));
                    activeGames.get(request.getGameId()).notifyAll();
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(board));
                }
                else
                {
                    return ResponseEntity.badRequest().body("You are not playing this game.");
                }
            }

            long now = Instant.now().toEpochMilli();
            if(board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now) <= 0)
            {
                board.setGameResult(GameResults.WHITE_TIMEOUT);
                board.setWhiteTime(0);
                activeBoards.replace(request.getGameId(), board);
                if(activeGames.get(request.getGameId()).isRated())
                    activeBoards.replace(request.getGameId(), chessGameService.updateRatings(activeGames.get(request.getGameId()), activeBoards.get(request.getGameId())));
                activeGames.get(request.getGameId()).notifyAll();
                return ResponseEntity.ok().body(BoardResponse.fromBoard(board));
            }
            else if(board.getBlackTime() - Math.abs(board.getLastMoveTime() - now) <= 0)
            {
                board.setGameResult(GameResults.BLACK_TIMEOUT);
                board.setBlackTime(0);
                activeBoards.replace(request.getGameId(), board);
                if(activeGames.get(request.getGameId()).isRated())
                    activeBoards.replace(request.getGameId(), chessGameService.updateRatings(activeGames.get(request.getGameId()), activeBoards.get(request.getGameId())));
                activeGames.get(request.getGameId()).notifyAll();
                return ResponseEntity.ok().body(BoardResponse.fromBoard(board));
            }

            if(board.isWhiteTurn() && !board.getWhiteEmail().equals(email)){
                return ResponseEntity.badRequest().body("It's not your turn.");
            }
            else if(!board.isWhiteTurn() && !board.getBlackEmail().equals(email)){
                return ResponseEntity.badRequest().body("It's not your turn.");
            }

            if(request.getMovedPiece() < 16 != board.isWhiteTurn())
                return ResponseEntity.badRequest().body("It's not your turn.");

            if(!board.getPosition().containsValue(request.getMovedPiece()))
                return ResponseEntity.badRequest().body("This piece does not exist.");

            if(!board.getPosition().containsKey(request.getStartField()))
                return ResponseEntity.badRequest().body("There is no piece on this field.");

            ArrayList<Integer> moves = board.possibleMoves(request.getStartField());
            moves = board.deleteImpossibleMoves(moves, request.getStartField());

            if(!moves.contains(request.getEndField())){
                return ResponseEntity.badRequest().body("Illegal move.");
            }

            long timeLeft = board.isWhiteTurn() ? board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now) : board.getBlackTime() - Math.abs(board.getLastMoveTime() - now);

            board = chessGameService.submitMove(request, board, activeGames.get(request.getGameId()));

            if(board.getGameResult() != GameResults.NONE)
            {
                activeBoards.replace(request.getGameId(), board);
                if(activeGames.get(request.getGameId()).isRated())
                    activeBoards.replace(request.getGameId(), chessGameService.updateRatings(activeGames.get(request.getGameId()), activeBoards.get(request.getGameId())));
                activeGames.get(request.getGameId()).notifyAll();
                return ResponseEntity.ok().body(BoardResponse.fromBoard(board));
            }

            activeBoards.replace(request.getGameId(), board);

            activeGames.get(request.getGameId()).notifyAll();

            activeGames.get(request.getGameId()).wait(timeLeft);

            if(activeBoards.get(request.getGameId()).getGameResult() != GameResults.NONE)
            {
                Board endBoard = activeBoards.get(request.getGameId());
                activeBoards.remove(request.getGameId());
                activeGames.get(request.getGameId()).setGameResult(endBoard.getGameResult());
                chessGameRepository.updateGameResult(request.getGameId(), endBoard.getGameResult());
                if(activeGames.get(request.getGameId()).isRated())
                    chessGameRepository.updateRating(request.getGameId(), endBoard.getWhiteRating(), endBoard.getBlackRating(), endBoard.getWhiteRatingChange(), endBoard.getBlackRatingChange());
                activeGames.remove(request.getGameId());
                return ResponseEntity.ok().body(BoardResponse.fromBoard(endBoard));
            }

            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    @PostMapping("/getGame/{gameId}")
    public ResponseEntity<?> getGame(@PathVariable("gameId") String gameId)
    {
        long id;
        try{
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body("Game not found.");
        }

        if(activeGames.containsKey(id))
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(id), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));

        if(!chessGameRepository.existsById(id))
            return ResponseEntity.badRequest().body("Game not found.");

        return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(chessGameRepository.findById(id).get(), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
    }

    @PostMapping("/getGameByUsername/{username}")
    public ResponseEntity<?> getGameByUsername(@PathVariable String username)
    {
        Optional<ChessGame> game = activeGames.values().stream().filter(x -> x.getBlackUser().getNameInGame().equals(username) || x.getWhiteUser().getNameInGame().equals(username)).findFirst();

        if(game.isPresent())
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game.get(), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
        else
            return ResponseEntity.badRequest().body("This player is not playing any game.");

    }

    @PostMapping("/getBoardByUsername/{username}")
    public ResponseEntity<?> getBoardByUsername(@PathVariable String username)
    {
        Optional<Board> board = activeBoards.values().stream().filter(x -> userRepository.findByEmail(x.getBlackEmail()).get().getNameInGame().equals(username) || userRepository.findByEmail(x.getWhiteEmail()).get().getNameInGame().equals(username)).findFirst();

        if(board.isPresent())
            return ResponseEntity.ok().body(BoardResponse.fromBoard(board.get()));
        else
            return ResponseEntity.badRequest().body("This player is not playing any game.");

    }

    @PostMapping("/getBoardByGameId/{gameId}")
    public ResponseEntity<?> getBoardByGameId(@PathVariable String gameId)
    {
        long id;
        try{
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body("Wrong game id.");
        }

        if(activeBoards.containsKey(id))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
        else
            return ResponseEntity.badRequest().body("Game not found.");

    }

    @PostMapping("/inviteFriend")
    public ResponseEntity<?> inviteFriend(@RequestBody GameInvitationRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        String friendEmail = userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail();

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email)))
        {
            return ResponseEntity.badRequest().body("User is already playing a game.");
        }

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(friendEmail) || game.getBlackUser().getEmail().equals(friendEmail)))
        {
            return ResponseEntity.badRequest().body("Friend is already playing a game.");
        }

        GameInvitation pendingInvitation = GameInvitation.builder()
                .user(userRepository.findByEmail(email).get())
                .friend(userRepository.findByEmail(friendEmail).get())
                .date(Instant.now())
                .timeControl(request.getTimeControl())
                .increment(request.getIncrement())
                .isRated(request.isRated())
                .build();

        pendingInvitations.put(email, pendingInvitation);

        synchronized(pendingInvitations.get(email))
        {
            pendingInvitations.get(email).wait(Constants.Application.gameSearchTime);

            if(pendingInvitations.get(email).getFriend() == null)
            {
                return ResponseEntity.badRequest().body("Friend didn't accept your request");
            }
            else
            {
                pendingInvitations.remove(email);

                pendingInvitations.get(friendEmail).wait(Constants.Application.timeout);

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(pendingInvitation.getId()), classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
            }
        }

    }

    @PostMapping("/respondToGameInvitation")
    public ResponseEntity<?> respondToGameInvitation(@RequestBody GameInvitationResponseRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

//        if(!gameInvitationRepository.existsByFriendEmailAndUserNameInGame(email, request.getFriendNickname()))
//            return ResponseEntity.badRequest().body("You have not been invited by this player.");

        if(request.getResponseType() == InvitationResponseType.ACCEPT)
        {
            String friendEmail = userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail();
            pendingInvitations.get(friendEmail).setFriend(userRepository.findByEmail(email).get());

            int whitePlayerIndex = ThreadLocalRandom.current().nextInt(2);
            int blackPlayerIndex = whitePlayerIndex == 0 ? 1 : 0;

            List<User> players = Arrays.asList(userRepository.findByEmail(friendEmail).get(), userRepository.findByEmail(email).get());

            ChessGame game = ChessGame.builder()
                    .startBoard(Constants.Boards.classicBoard)
                    .whiteStarts(true)
                    .whiteUser(players.get(whitePlayerIndex))
                    .blackUser(players.get(blackPlayerIndex))
                    .availableCastles(new int[]{0, 0, 0, 0})
                    .timeControl(pendingInvitations.get(friendEmail).getTimeControl())
                    .increment(pendingInvitations.get(friendEmail).getIncrement())
                    .gameType(HelpMethods.getGameType(pendingInvitations.get(friendEmail).getTimeControl()))
                    .startTime(Instant.now().toEpochMilli())
                    .isRated(pendingInvitations.get(friendEmail).isRated())
                    .build();

            chessGameRepository.save(game);

            activeBoards.put(game.getId(), Board.fromGame(game));
            activeGames.put(game.getId(), game);

            pendingInvitations.get(friendEmail).setId(game.getId());

            pendingInvitations.get(friendEmail).notifyAll();

            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game, classicalRatingRepository, rapidRatingRepository, blitzRatingRepository, bulletRatingRepository));
        }

//        gameInvitationRepository.deleteByUserNameInGameAndFriendEmail(request.getFriendNickname(), email);

        return ResponseEntity.ok().body("Invitation responded.");
    }
}