package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.*;
import com.chessin.controller.responses.BoardResponse;
import com.chessin.controller.responses.ChessGameResponse;
import com.chessin.controller.responses.MessageResponse;
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
import org.springframework.http.HttpStatus;
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
    private final UserService userService;

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
            return ResponseEntity.badRequest().body(MessageResponse.of("User is already searching for a game."));
        }

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email)))
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("User is already playing a game."));
        }

        PendingChessGame foundGame = chessGameService.searchNewGame(request, new ArrayList<>(pendingGames.values()));

        if(foundGame != null)
        {
            synchronized(pendingGames.get(foundGame.getUser().getEmail()))
            {
                pendingGames.get(foundGame.getUser().getEmail()).setOpponent(userRepository.findByEmail(email).get());

                int whitePlayerIndex = ThreadLocalRandom.current().nextInt(2);
                int blackPlayerIndex = whitePlayerIndex == 0 ? 1 : 0;

                whitePlayerIndex = 1;
                blackPlayerIndex = 0;

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
                        .gameResult(GameResults.NONE)
                        .whiteRating(userService.getRating(players.get(whitePlayerIndex), HelpMethods.getGameType(foundGame.getTimeControl())))
                        .blackRating(userService.getRating(players.get(blackPlayerIndex), HelpMethods.getGameType(foundGame.getTimeControl())))
                        .build();

                chessGameRepository.save(game);

                pendingGames.get(foundGame.getUser().getEmail()).setId(game.getId());

                activeBoards.put(game.getId(), Board.fromGame(game));
                activeGames.put(game.getId(), game);

                pendingGames.get(foundGame.getUser().getEmail()).notifyAll();

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game, userService));
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

        synchronized (pendingGames.get(pendingChessGame.getUser().getEmail()))
        {
            pendingGames.get(pendingChessGame.getUser().getEmail()).wait(Constants.Application.GAME_SEARCH_TIME);

            if(!pendingGames.containsKey(pendingChessGame.getUser().getEmail()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            if (pendingGames.get(pendingChessGame.getUser().getEmail()).getOpponent() == null) {
                pendingGames.remove(pendingChessGame.getUser().getEmail());
                return ResponseEntity.badRequest().body(MessageResponse.of("No opponent found"));
            }
            else
            {
                pendingGames.get(pendingChessGame.getUser().getEmail()).wait(Constants.Application.TIMEOUT);

                if(!pendingGames.containsKey(pendingChessGame.getUser().getEmail()))
                    return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

                pendingGames.remove(pendingChessGame.getUser().getEmail());

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(pendingChessGame.getId()), userService));
            }
        }
    }

    @Transactional
    @PostMapping("/cancelSearch")
    public ResponseEntity<?> cancelSearch(HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("User not found"));

        if(pendingGames.get(email) != null)
            pendingGames.remove(email);
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("No search found"));

        return ResponseEntity.ok().body(MessageResponse.of("Search cancelled"));
    }

    @Transactional
    @PostMapping("/listenForMove")
    public ResponseEntity<?> listenForMove(@RequestBody ListenForMoveRequest request) throws InterruptedException {
        if(!activeGames.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found"));

        if(!chessGameService.validateMoves(request.getMoves(), activeBoards.get(request.getGameId())))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameService.calculateTime(activeBoards.get(request.getGameId()))));

        synchronized(activeGames.get(request.getGameId()))
        {
            activeGames.get(request.getGameId()).wait(Constants.Application.WAIT_FOR_MOVE_TIME);

            if(!activeBoards.containsKey(request.getGameId()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    @Transactional
    @PostMapping("/listenForFirstMove/{gameId}")
    public ResponseEntity<?> listenForFirstMove(@PathVariable String gameId) throws InterruptedException {
        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id"));
        }

        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if(!activeBoards.get(id).getMoves().isEmpty())
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameService.calculateTime(activeBoards.get(id))));

        synchronized(activeGames.get(id))
        {
            activeGames.get(id).wait(Constants.Application.WAIT_FOR_MOVE_TIME);

            if(activeBoards.containsKey(id))
            {
                if (activeBoards.get(id).getGameResult() == GameResults.NONE) {
                    if (activeBoards.get(id).getMoves() == null || activeBoards.get(id).getMoves().isEmpty()) {
                        Board endBoard = activeBoards.get(id);
                        endBoard.setGameResult(GameResults.ABANDONED);
                        chessGameRepository.updateGameResult(id, GameResults.ABANDONED);
                        activeBoards.remove(id);
                        activeGames.remove(id);
                        return ResponseEntity.ok().body(BoardResponse.fromBoard(endBoard));
                    } else
                        return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
                } else
                    return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));
            }
            else
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));
        }
    }

    @Transactional
    @PostMapping("/submitMove")
    public ResponseEntity<?> submitMove(@RequestBody SubmitMoveRequest request, HttpServletRequest servlet) throws InterruptedException {
        if(!activeBoards.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeGames.get(request.getGameId()))
        {
            String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

            Board board = activeBoards.get(request.getGameId());

            long now = Instant.now().toEpochMilli();
            if(board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now) <= 0)
            {
                activeBoards.get(request.getGameId()).setWhiteTime(0);
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(request.getGameId(), Optional.of(GameResults.WHITE_TIMEOUT))));
            }
            else if(board.getBlackTime() - Math.abs(board.getLastMoveTime() - now) <= 0)
            {
                activeBoards.get(request.getGameId()).setBlackTime(0);
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(request.getGameId(), Optional.of(GameResults.BLACK_TIMEOUT))));
            }

            if(board.isWhiteTurn() && !board.getWhiteEmail().equals(email)){
                return ResponseEntity.badRequest().body(MessageResponse.of("It's not your turn."));
            }
            else if(!board.isWhiteTurn() && !board.getBlackEmail().equals(email)){
                return ResponseEntity.badRequest().body(MessageResponse.of("It's not your turn."));
            }

            if(request.getMovedPiece() < 16 != board.isWhiteTurn())
                return ResponseEntity.badRequest().body(MessageResponse.of("It's not your turn."));

            if(!board.getPosition().containsValue(request.getMovedPiece()))
                return ResponseEntity.badRequest().body(MessageResponse.of("This piece does not exist."));

            if(!board.getPosition().containsKey(request.getStartField()))
                return ResponseEntity.badRequest().body(MessageResponse.of("There is no piece on this field."));

            ArrayList<Integer> moves = board.possibleMoves(request.getStartField());
            moves = board.deleteImpossibleMoves(moves, request.getStartField());

            if(!moves.contains(request.getEndField())){
                return ResponseEntity.badRequest().body(MessageResponse.of("Illegal move."));
            }

            long timeLeft = board.isWhiteTurn() ? board.getWhiteTime() - Math.abs(board.getLastMoveTime() - now) : board.getBlackTime() - Math.abs(board.getLastMoveTime() - now);

            board = chessGameService.submitMove(request, board, activeGames.get(request.getGameId()));

            activeBoards.replace(request.getGameId(), board);

            if(board.getGameResult() != GameResults.NONE)
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(request.getGameId(), Optional.empty())));
            }

            activeGames.get(request.getGameId()).notifyAll();

            activeGames.get(request.getGameId()).wait(timeLeft);

            if(!activeBoards.containsKey(request.getGameId()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            if(Arrays.asList(GameResults.DRAW_AGREEMENT, GameResults.BLACK_RESIGN, GameResults.WHITE_RESIGN).contains(activeBoards.get(request.getGameId()).getGameResult()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));

            if(activeBoards.get(request.getGameId()).getGameResult() != GameResults.NONE)
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(request.getGameId())));
            }

            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    @Transactional
    public Board finishGame(long gameId, Optional<GameResults> gameResult)
    {
        synchronized(activeGames.get(gameId))
        {
            synchronized(activeBoards.get(gameId))
            {
                gameResult.ifPresent(gameResults -> activeBoards.get(gameId).setGameResult(gameResults));
                chessGameRepository.updateGameResult(gameId, gameResult.orElse(activeBoards.get(gameId).getGameResult()));
                if (activeGames.get(gameId).isRated())
                    activeBoards.replace(gameId, chessGameService.updateRatings(activeGames.get(gameId), activeBoards.get(gameId)));
                activeGames.get(gameId).notifyAll();
                activeBoards.get(gameId).notifyAll();
                return activeBoards.get(gameId);
            }
        }
    }

    @Transactional
    public Board clearGame(long gameId)
    {
        synchronized(activeGames.get(gameId))
        {
            synchronized(activeBoards.get(gameId))
            {
                Board endBoard = activeBoards.get(gameId);
                activeBoards.remove(gameId);
                activeGames.remove(gameId);
                return endBoard;
            }
        }
    }

    @Transactional
    @PostMapping("/listenForResignation/{gameId}")
    public ResponseEntity<?> listenForResignation(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            activeBoards.get(id).wait(Constants.Application.WAIT_FOR_MOVE_TIME);

            if(!activeBoards.containsKey(id))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            if(activeBoards.get(id).getGameResult() != GameResults.NONE)
            {
                if((activeBoards.get(id).getGameResult() == GameResults.WHITE_RESIGN && activeBoards.get(id).getWhiteEmail().equals(email)) || (activeBoards.get(id).getGameResult() == GameResults.BLACK_RESIGN && activeBoards.get(id).getBlackEmail().equals(email)))
                    return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));
                else
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(id)));
            }
            else
            {
                return ResponseEntity.status(HttpStatus.CONTINUE).body(MessageResponse.of("Opponent has not resigned."));
            }
        }
    }

    @Transactional
    @PostMapping("/resign/{gameId}")
    public ResponseEntity<?> resign(@PathVariable String gameId, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            if(activeBoards.get(id).getWhiteEmail().equals(email))
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(id, Optional.of(GameResults.WHITE_RESIGN))));
            }
            else if(activeBoards.get(id).getBlackEmail().equals(email))
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(id, Optional.of(GameResults.BLACK_RESIGN))));
            }
            else
            {
                return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));
            }
        }
    }

    @Transactional
    @PostMapping("/listenForDrawOffer/{gameId}")
    public ResponseEntity<?> listenForDrawOffer(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            activeBoards.get(id).wait(Constants.Application.WAIT_FOR_MOVE_TIME);

            if(activeBoards.containsKey(id))
            {
                if (activeBoards.get(id).isWhiteOffersDraw() || activeBoards.get(id).isBlackOffersDraw())
                {
                    if ((activeBoards.get(id).isWhiteOffersDraw() && activeBoards.get(id).getWhiteEmail().equals(email)) || (activeBoards.get(id).isBlackOffersDraw() && activeBoards.get(id).getBlackEmail().equals(email)))
                        return ResponseEntity.accepted().body(MessageResponse.of("Draw successfully offered."));
                    else
                        return ResponseEntity.ok().body(MessageResponse.of("Opponent has requested draw."));
                }
                else
                    return ResponseEntity.accepted().body(MessageResponse.of("Opponent has not requested draw."));
            }
            else
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));
        }
    }

    @Transactional
    @PostMapping("/offerDraw/{gameId}")
    public ResponseEntity<?> offerDraw(@PathVariable String gameId, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Long.parseLong(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!activeBoards.get(id).getWhiteEmail().equals(email) && !activeBoards.get(id).getBlackEmail().equals(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));

        if(activeBoards.get(id).isBlackOffersDraw() || activeBoards.get(id).isWhiteOffersDraw())
            return ResponseEntity.badRequest().body(MessageResponse.of("You have already offered draw."));

        synchronized(activeBoards.get(id))
        {
            if(activeBoards.get(id).getWhiteEmail().equals(email))
                activeBoards.get(id).setWhiteOffersDraw(true);
            else
                activeBoards.get(id).setBlackOffersDraw(true);

            activeBoards.get(id).notifyAll();
            activeBoards.get(id).wait(Constants.Application.WAIT_FOR_MOVE_TIME);

            if(activeBoards.containsKey(id))
            {
                if (activeBoards.get(id).getGameResult() != GameResults.NONE) {
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(id)));
                } else
                    return ResponseEntity.accepted().body(MessageResponse.of("Opponent has not accepted draw."));
            }
            else
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));
        }
    }

    @Transactional
    @PostMapping("/respondToDrawOffer")
    public ResponseEntity<?> respondToDrawOffer(@RequestBody RespondToDrawOfferRequest request, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        if(!activeBoards.get(request.getGameId()).getWhiteEmail().equals(email) && !activeBoards.get(request.getGameId()).getBlackEmail().equals(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));

        if(!activeBoards.get(request.getGameId()).isBlackOffersDraw() && !activeBoards.get(request.getGameId()).isWhiteOffersDraw())
            return ResponseEntity.badRequest().body(MessageResponse.of("Opponent has not offered draw."));

        if(activeBoards.get(request.getGameId()).getWhiteEmail().equals(email) && activeBoards.get(request.getGameId()).isWhiteOffersDraw())
            return ResponseEntity.badRequest().body(MessageResponse.of("You cannot respond to your own draw offer."));
        else if(activeBoards.get(request.getGameId()).getBlackEmail().equals(email) && activeBoards.get(request.getGameId()).isBlackOffersDraw())
            return ResponseEntity.badRequest().body(MessageResponse.of("You cannot respond to your own draw offer."));

        synchronized(activeBoards.get(request.getGameId()))
        {
            if(request.getResponseType() == ResponseType.ACCEPT)
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(request.getGameId(), Optional.of(GameResults.DRAW_AGREEMENT))));
            }
            else
            {
                activeBoards.get(request.getGameId()).setWhiteOffersDraw(false);
                activeBoards.get(request.getGameId()).setBlackOffersDraw(false);
                activeBoards.get(request.getGameId()).notifyAll();
                return ResponseEntity.accepted().body(MessageResponse.of("Draw offer declined."));
            }
        }
    }

    @Transactional
    @PostMapping("/cancelDrawOffer/{gameId}")
    public ResponseEntity<?> cancelDrawOffer(@PathVariable String gameId, HttpServletRequest servlet)
    {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        long id;

        try {
            id = Integer.parseInt(gameId);
        }
        catch (NumberFormatException e)
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!activeBoards.get(id).getWhiteEmail().equals(email) && !activeBoards.get(id).getBlackEmail().equals(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));


        synchronized(activeBoards.get(id))
        {
            if(activeBoards.get(id).getWhiteEmail().equals(email) && activeBoards.get(id).isWhiteOffersDraw()) {
                activeBoards.get(id).setWhiteOffersDraw(false);
                activeBoards.get(id).notifyAll();
            }
            else if(activeBoards.get(id).getBlackEmail().equals(email) && activeBoards.get(id).isBlackOffersDraw()) {
                activeBoards.get(id).setBlackOffersDraw(false);
                activeBoards.get(id).notifyAll();
            }
            else
                return ResponseEntity.badRequest().body(MessageResponse.of("You have not offered draw."));
        }

        return ResponseEntity.ok().body(MessageResponse.of("Draw offer cancelled."));
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
            return ResponseEntity.badRequest().body(MessageResponse.of("Invalid game id."));
        }

        if(!chessGameRepository.existsById(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if(activeGames.containsKey(id))
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(id), userService));

        return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(chessGameRepository.findById(id).get(), userService));
    }

    @PostMapping("/getGameByUsername/{username}")
    public ResponseEntity<?> getGameByUsername(@PathVariable String username)
    {
        Optional<ChessGame> game = activeGames.values().stream().filter(x -> x.getBlackUser().getNameInGame().equals(username) || x.getWhiteUser().getNameInGame().equals(username)).findFirst();

        if(game.isPresent())
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game.get(), userService));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("This player is not playing any game."));

    }

    @PostMapping("/getBoardByUsername/{username}")
    public ResponseEntity<?> getBoardByUsername(@PathVariable String username)
    {
        Optional<Board> board = activeBoards.values().stream().filter(x -> userRepository.findByEmail(x.getBlackEmail()).get().getNameInGame().equals(username) || userRepository.findByEmail(x.getWhiteEmail()).get().getNameInGame().equals(username)).findFirst();

        if(board.isPresent())
            return ResponseEntity.ok().body(BoardResponse.fromBoard(board.get()));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("This player is not playing any game."));

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
            return ResponseEntity.badRequest().body(MessageResponse.of("Wrong game id."));
        }

        if(activeBoards.containsKey(id))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

    }

    @PostMapping("/isUserPlaying/{username}")
    public ResponseEntity<?> isUserPlaying(@PathVariable String username)
    {
        String email = userRepository.findByNameInGame(username).get().getEmail();
        boolean isPlaying = activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email));

        return isPlaying ? ResponseEntity.ok().body(MessageResponse.of("True")) : ResponseEntity.ok().body(MessageResponse.of("False"));
    }

    @PostMapping("/isUserPlayingTimeControl/{username}/{timeControl}/{increment}")
    public ResponseEntity<?> isUserPlayingTimeControl(@PathVariable String username, @PathVariable int timeControl, @PathVariable int increment)
    {
        String email = userRepository.findByNameInGame(username).get().getEmail();
        boolean isPlaying = activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email));

        if(isPlaying)
        {
            List<ChessGame> games = activeGames.values().stream().filter(x -> x.getWhiteUser().getEmail().equals(email) || x.getBlackUser().getEmail().equals(email)).toList();

            for(ChessGame game : games)
            {
                if(game.getTimeControl() == timeControl && game.getIncrement() == increment)
                    return ResponseEntity.ok().body(MessageResponse.of("True"));
                else
                    return ResponseEntity.ok().body(MessageResponse.of("False"));
            }
        }

        return ResponseEntity.ok().body(MessageResponse.of("False"));
    }

    @Transactional
    @PostMapping("/inviteFriend")
    public ResponseEntity<?> inviteFriend(@RequestBody GameInvitationRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));

        String friendEmail = userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail();

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email)))
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("User is already playing a game."));
        }

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(friendEmail) || game.getBlackUser().getEmail().equals(friendEmail)))
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("Friend is already playing a game."));
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
            pendingInvitations.get(email).wait(Constants.Application.GAME_SEARCH_TIME);

            if(!pendingInvitations.containsKey(email))
                return ResponseEntity.accepted().body(MessageResponse.of("Invitation not found."));

            if(pendingInvitations.get(email).getFriend() == null)
            {
                return ResponseEntity.badRequest().body(MessageResponse.of("Friend didn't accept your request"));
            }
            else
            {
                pendingInvitations.get(email).wait(Constants.Application.TIMEOUT);

                if(!pendingInvitations.containsKey(email))
                    return ResponseEntity.accepted().body(MessageResponse.of("Invitation not found."));

                pendingInvitations.remove(email);

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(pendingInvitation.getId()), userService));
            }
        }
    }

    @Transactional
    @PostMapping("/respondToGameInvitation")
    public ResponseEntity<?> respondToGameInvitation(@RequestBody GameInvitationResponseRequest request, HttpServletRequest servlet) throws InterruptedException {
        String email = jwtService.extractUsername(servlet.getHeader("Authorization").substring(7));
        String friendEmail = userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail();

        if(!pendingInvitations.containsKey(friendEmail))
            return ResponseEntity.badRequest().body(MessageResponse.of("You have not been invited by this player."));

        if(request.getResponseType() == ResponseType.ACCEPT)
        {
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
                    .gameResult(GameResults.NONE)
                    .build();

            chessGameRepository.save(game);

            activeBoards.put(game.getId(), Board.fromGame(game));
            activeGames.put(game.getId(), game);

            pendingInvitations.get(friendEmail).setId(game.getId());

            pendingInvitations.get(friendEmail).notifyAll();

            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game, userService));
        }

        pendingInvitations.get(friendEmail).notifyAll();

        pendingInvitations.remove(friendEmail);

        return ResponseEntity.ok().body(MessageResponse.of("Invitation responded."));
    }
}