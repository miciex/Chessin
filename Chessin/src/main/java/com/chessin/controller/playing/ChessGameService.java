package com.chessin.controller.playing;

import com.chessin.controller.register.UserService;
import com.chessin.controller.requests.*;
import com.chessin.controller.responses.*;
import com.chessin.model.playing.*;
import com.chessin.model.playing.Glicko2.Entities.*;
import com.chessin.model.playing.Glicko2.RatingCalculator;
import com.chessin.model.playing.Glicko2.Repositories.BlitzRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.BulletRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.ClassicalRatingRepository;
import com.chessin.model.playing.Glicko2.Repositories.RapidRatingRepository;
import com.chessin.model.playing.Glicko2.Result;
import com.chessin.model.register.user.User;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.utils.Constants;
import com.chessin.model.utils.Convert;
import com.chessin.model.utils.HelpMethods;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Transactional
public class ChessGameService {
    private final ChessGameRepository chessGameRepository;
    private final UserRepository userRepository;
    private final ChessGameHelper chessGameHelper;
    private final UserService userService;

    private final ConcurrentHashMap<String, PendingChessGame> pendingGames = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Board> activeBoards = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, ChessGame> activeGames = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Disconnection> disconnections = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, GameInvitation> pendingInvitations = new ConcurrentHashMap<>();

    public ResponseEntity<?> searchNewGame(PendingChessGameRequest request, String email) throws InterruptedException {

        if(pendingGames.containsKey(email))
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("User is already searching for a game."));
        }

        if(activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email)))
        {
            return ResponseEntity.badRequest().body(MessageResponse.of("User is already playing a game."));
        }

        PendingChessGame foundGame = chessGameHelper.findGame(request, new ArrayList<>(pendingGames.values()));

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
                        .gameType(HelpMethods.getGameType(foundGame.getTimeControl(), foundGame.getIncrement()))
                        .startTime(Instant.now().toEpochMilli())
                        .isRated(foundGame.isRated())
                        .gameResult(GameResults.NONE)
                        .whiteRating(userService.getRating(players.get(whitePlayerIndex), HelpMethods.getGameType(foundGame.getTimeControl(), foundGame.getIncrement())))
                        .blackRating(userService.getRating(players.get(blackPlayerIndex), HelpMethods.getGameType(foundGame.getTimeControl(), foundGame.getIncrement())))
                        .build();

                chessGameRepository.save(game);
                chessGameRepository.save(game);

                pendingGames.get(foundGame.getUser().getEmail()).setId(game.getId());

                activeBoards.put(game.getId(), Board.fromGame(game));
                activeGames.put(game.getId(), game);
                disconnections.put(game.getId(), Disconnection.builder()
                        .whiteDisconnected(false)
                        .blackDisconnected(false)
                        .realDisconnection(false)
                        .ping(new Object())
                        .listener(new Object())
                        .build());

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

        synchronized(pendingGames.get(email))
        {
            pendingGames.get(email).wait(Constants.Application.GAME_SEARCH_TIME);

            if(!pendingGames.containsKey(email))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            if (pendingGames.get(email).getOpponent() == null) {
                pendingGames.remove(email);
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

    public ResponseEntity<?> cancelSearch(String email)
    {
        if(!userRepository.existsByEmail(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("User not found"));

        if(pendingGames.containsKey(email))
            pendingGames.remove(email);
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("No search found"));

        return ResponseEntity.ok().body(MessageResponse.of("Search cancelled"));
    }

    public ResponseEntity<?> ping(long id, String email) throws InterruptedException {
        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if(!activeBoards.get(id).getWhiteEmail().equals(email) && !activeBoards.get(id).getBlackEmail().equals(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));

        boolean isWhite = activeBoards.get(id).getWhiteEmail().equals(email);

        synchronized(disconnections.get(id).getPing())
        {
            if(((isWhite && disconnections.get(id).isBlackDisconnected()) || (!isWhite && disconnections.get(id).isWhiteDisconnected())) && disconnections.get(id).isRealDisconnection())
                return ResponseEntity.ok().body(DisconnectionStatus.NO_CHANGE);

            disconnections.get(id).setBlackDisconnected(isWhite);
            disconnections.get(id).setWhiteDisconnected(!isWhite);

            disconnections.get(id).getPing().notifyAll();
            disconnections.get(id).getPing().wait(Constants.Application.WAIT_FOR_PING_TIME);

            if(!disconnections.containsKey(id))
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

            if((isWhite && disconnections.get(id).isBlackDisconnected()) || (!isWhite && disconnections.get(id).isWhiteDisconnected()))
            {
                //disconnections.get(id).getPing().notifyAll();
                disconnections.get(id).setRealDisconnection(true);
                synchronized(disconnections.get(id).getListener()) {
                    disconnections.get(id).getListener().notifyAll();
                }

                disconnections.get(id).getPing().wait(HelpMethods.getDisconnectionTime(activeGames.get(id).getGameType()));

                if(!disconnections.containsKey(id))
                    return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

                if((isWhite && disconnections.get(id).isBlackDisconnected()) || (!isWhite && disconnections.get(id).isWhiteDisconnected()))
                {
                    if(activeBoards.get(id).getMoves().size() < 2)
                        finishGame(id, Optional.of(GameResults.ABANDONED));
                    else
                        finishGame(id, Optional.of(isWhite ? GameResults.BLACK_DISCONNECTED : GameResults.WHITE_DISCONNECTED));

                    return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(id)));
                }
                else {
                    disconnections.get(id).setRealDisconnection(false);
                    return ResponseEntity.ok().body(DisconnectionStatus.RECONNECTED);
                }
            }
            else
                return ResponseEntity.ok().body(DisconnectionStatus.FINE);
        }
    }

    public ResponseEntity<?> listenForDisconnection(long id, String email) throws InterruptedException {
        if (!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if (!activeBoards.get(id).getWhiteEmail().equals(email) && !activeBoards.get(id).getBlackEmail().equals(email))
            return ResponseEntity.badRequest().body(MessageResponse.of("You are not playing this game."));

        boolean isWhite = activeBoards.get(id).getWhiteEmail().equals(email);

        synchronized(disconnections.get(id).getListener())
        {
            disconnections.get(id).getListener().wait(Constants.Application.LISTEN_TIME);

            if(!disconnections.containsKey(id))
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

            if(((isWhite && disconnections.get(id).isBlackDisconnected()) || (!isWhite && disconnections.get(id).isWhiteDisconnected())) && activeBoards.containsKey(id))
                return ResponseEntity.ok().body(DisconnectionResponse.builder()
                        .disconnectionStatus(DisconnectionStatus.DISCONNECTED)
                        .disconnectionTime(HelpMethods.getDisconnectionTime(activeGames.get(id).getGameType()))
                        .build());
            else
                return ResponseEntity.ok().body(DisconnectionStatus.FINE);
        }
    }

    public ResponseEntity<?> listenForMove(ListenForMoveRequest request) throws InterruptedException {
        if(!activeGames.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found"));

        if(!chessGameHelper.validateMoves(request.getMoves(), activeBoards.get(request.getGameId())))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameHelper.calculateTime(activeBoards.get(request.getGameId()))));

        synchronized(activeGames.get(request.getGameId()))
        {
            activeGames.get(request.getGameId()).wait(Constants.Application.LISTEN_TIME);

            if(!activeBoards.containsKey(request.getGameId()))
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

            if(activeBoards.get(request.getGameId()).getGameResult() != GameResults.NONE)
                return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));
            else
                return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    public ResponseEntity<?> listenForFirstMove(long id) throws InterruptedException {
        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if(!activeBoards.get(id).getMoves().isEmpty())
            return ResponseEntity.ok().body(BoardResponse.fromBoard(chessGameHelper.calculateTime(activeBoards.get(id))));

        synchronized(activeGames.get(id))
        {
            activeGames.get(id).wait(Constants.Application.LISTEN_TIME);

            if(!activeBoards.containsKey(id))
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

            if(activeBoards.get(id).getGameResult() != GameResults.NONE)
                return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));
            else
                return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
        }
    }

    public ResponseEntity<?> submitMove(SubmitMoveRequest request, String email) throws InterruptedException {
        if(!activeBoards.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeGames.get(request.getGameId()))
        {
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

            board = chessGameHelper.submitMove(request, board, activeGames.get(request.getGameId()));

            activeBoards.replace(request.getGameId(), board);

            if(board.getGameResult() != GameResults.NONE)
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(request.getGameId(), Optional.empty())));
            }

            activeGames.get(request.getGameId()).notifyAll();

            activeGames.get(request.getGameId()).wait(timeLeft);

            if(!activeBoards.containsKey(request.getGameId()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game not found."));

            if(Arrays.asList(GameResults.DRAW_AGREEMENT, GameResults.BLACK_RESIGN, GameResults.WHITE_RESIGN, GameResults.ABANDONED, GameResults.BLACK_TIMEOUT, GameResults.WHITE_TIMEOUT, GameResults.WHITE_ABANDONED, GameResults.BLACK_ABANDONED).contains(activeBoards.get(request.getGameId()).getGameResult()))
                return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));

            if(activeBoards.get(request.getGameId()).getGameResult() != GameResults.NONE)
            {
                return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(request.getGameId())));
            }

            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(request.getGameId())));
        }
    }

    public ResponseEntity<?> listenForResignation(long id, String email) throws InterruptedException {
        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            activeBoards.get(id).wait(Constants.Application.LISTEN_TIME);

            if(!activeBoards.containsKey(id))
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

            if(activeBoards.get(id).getGameResult() != GameResults.NONE)
            {
                if((Arrays.asList(GameResults.WHITE_RESIGN, GameResults.WHITE_ABANDONED).contains(activeBoards.get(id).getGameResult()) && activeBoards.get(id).getWhiteEmail().equals(email)) || (Arrays.asList(GameResults.BLACK_RESIGN, GameResults.BLACK_ABANDONED).contains(activeBoards.get(id).getGameResult()) && activeBoards.get(id).getBlackEmail().equals(email)))
                    return ResponseEntity.accepted().body(MessageResponse.of("Game has ended."));
                else
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(id)));
            }
            else
            {
                return ResponseEntity.accepted().body(MessageResponse.of("Opponent has not resigned."));
            }
        }
    }

    public ResponseEntity<?> resign(long id, String email)
    {
        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            if(activeBoards.get(id).getMoves().size() < 2)
            {
                if(activeBoards.get(id).getWhiteEmail().equals(email))
                    activeBoards.get(id).setGameResult(GameResults.WHITE_ABANDONED);
                else
                    activeBoards.get(id).setGameResult(GameResults.BLACK_ABANDONED);

                return ResponseEntity.ok().body(BoardResponse.fromBoard(finishGame(id, Optional.empty())));
            }

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

    public ResponseEntity<?> listenForDrawOffer(long id, String email) throws InterruptedException {
        if(!activeBoards.containsKey(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        synchronized(activeBoards.get(id))
        {
            activeBoards.get(id).wait(Constants.Application.LISTEN_TIME);

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

    public ResponseEntity<?> offerDraw(long id, String email) throws InterruptedException {
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
            activeBoards.get(id).wait(Constants.Application.LISTEN_TIME);

            if(activeBoards.containsKey(id))
            {
                if (activeBoards.get(id).getGameResult() != GameResults.NONE) {
                    return ResponseEntity.ok().body(BoardResponse.fromBoard(clearGame(id)));
                } else
                    return ResponseEntity.accepted().body(MessageResponse.of("Opponent has not accepted draw."));
            }
            else
                return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));
        }
    }

    public ResponseEntity<?> respondToDrawOffer(RespondToDrawOfferRequest request, String email)
    {
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

    public ResponseEntity<?> cancelDrawOffer(long id, String email)
    {
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

    public ResponseEntity<?> getGame(long id)
    {
        if(!chessGameRepository.existsById(id))
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));

        if(activeGames.containsKey(id))
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(activeGames.get(id), userService));

        return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(chessGameRepository.findById(id).get(), userService));
    }

    public ResponseEntity<?> getGameByUsername(String username)
    {
        Optional<ChessGame> game = getGameByEmail(userRepository.findByNameInGame(username).get().getEmail());

        if(game.isPresent())
            return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game.get(), userService));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("This player is not playing any game."));
    }

    public ResponseEntity<?> getBoardByUsername(String username)
    {
        Optional<Board> board = activeBoards.values().stream().filter(x -> userRepository.findByEmail(x.getBlackEmail()).get().getNameInGame().equals(username) || userRepository.findByEmail(x.getWhiteEmail()).get().getNameInGame().equals(username)).findFirst();

        if(board.isPresent())
            return ResponseEntity.ok().body(BoardResponse.fromBoard(board.get()));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("This player is not playing any game."));
    }

    public ResponseEntity<?> getBoardByGameId(long id)
    {
        if(activeBoards.containsKey(id))
            return ResponseEntity.ok().body(BoardResponse.fromBoard(activeBoards.get(id)));
        else
            return ResponseEntity.badRequest().body(MessageResponse.of("Game not found."));
    }

    public ResponseEntity<?> isUserPlaying(String username)
    {
        String email = userRepository.findByNameInGame(username).get().getEmail();
        boolean isPlaying = activeGames.values().stream().anyMatch(game -> game.getWhiteUser().getEmail().equals(email) || game.getBlackUser().getEmail().equals(email));

        return isPlaying ? ResponseEntity.ok().body(MessageResponse.of("True")) : ResponseEntity.ok().body(MessageResponse.of("False"));
    }

    public ResponseEntity<?> isUserPlayingTimeControl(String username, long timeControl, long increment)
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

    public ResponseEntity<?> inviteFriend(GameInvitationRequest request, String email) throws InterruptedException {
        if(!userRepository.existsByNameInGame(request.getFriendNickname()))
            return ResponseEntity.badRequest().body(MessageResponse.of("User not found."));

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
                .playerColor(request.getPlayerColor())
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

    public ResponseEntity<?> respondToGameInvitation(GameInvitationResponseRequest request, String email)
    {
        if(!userRepository.existsByNameInGame(request.getFriendNickname()))
            return ResponseEntity.badRequest().body(MessageResponse.of("User not found."));

        String friendEmail = userRepository.findByNameInGame(request.getFriendNickname()).get().getEmail();

        if(!pendingInvitations.containsKey(friendEmail))
            return ResponseEntity.badRequest().body(MessageResponse.of("You have not been invited by this player."));

        synchronized(pendingInvitations.get(friendEmail))
        {
            if (request.getResponseType() == ResponseType.ACCEPT) {
                pendingInvitations.get(friendEmail).setFriend(userRepository.findByEmail(email).get());

                int whitePlayerIndex, blackPlayerIndex;

                if (pendingInvitations.get(friendEmail).getPlayerColor() == PlayerColor.RANDOM) {
                    whitePlayerIndex = ThreadLocalRandom.current().nextInt(2);
                    blackPlayerIndex = whitePlayerIndex == 0 ? 1 : 0;
                } else {
                    whitePlayerIndex = pendingInvitations.get(friendEmail).getPlayerColor() == PlayerColor.WHITE ? 0 : 1;
                    blackPlayerIndex = whitePlayerIndex == 0 ? 1 : 0;
                }

                List<User> players = Arrays.asList(userRepository.findByEmail(friendEmail).get(), userRepository.findByEmail(email).get());

                ChessGame game = ChessGame.builder()
                        .startBoard(Constants.Boards.classicBoard)
                        .whiteStarts(true)
                        .whiteUser(players.get(whitePlayerIndex))
                        .blackUser(players.get(blackPlayerIndex))
                        .availableCastles(new int[]{0, 0, 0, 0})
                        .timeControl(pendingInvitations.get(friendEmail).getTimeControl())
                        .increment(pendingInvitations.get(friendEmail).getIncrement())
                        .gameType(HelpMethods.getGameType(pendingInvitations.get(friendEmail).getTimeControl(), pendingInvitations.get(friendEmail).getIncrement()))
                        .startTime(Instant.now().toEpochMilli())
                        .isRated(pendingInvitations.get(friendEmail).isRated())
                        .gameResult(GameResults.NONE)
                        .build();

                chessGameRepository.save(game);

                activeBoards.put(game.getId(), Board.fromGame(game));
                activeGames.put(game.getId(), game);
                disconnections.put(game.getId(), Disconnection.builder()
                        .whiteDisconnected(false)
                        .blackDisconnected(false)
                        .realDisconnection(false)
                        .ping(new Object())
                        .listener(new Object())
                        .build());

                pendingInvitations.get(friendEmail).setId(game.getId());

                pendingInvitations.get(friendEmail).notifyAll();

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game, userService));
            }

            pendingInvitations.get(friendEmail).notifyAll();

            pendingInvitations.remove(friendEmail);

            return ResponseEntity.ok().body(MessageResponse.of("Invitation responded."));
        }
    }

    public ResponseEntity<?> checkGameInvitations(String email)
    {
        List<GameInvitation> invitations = pendingInvitations.values().stream().filter(x -> x.getFriend().getEmail().equals(email)).toList();

        if(invitations.isEmpty())
            return ResponseEntity.ok().body(MessageResponse.of("No invitations."));

        List<GameInvitationResponse> responses = invitations.stream().map((GameInvitation invitation) -> GameInvitationResponse.fromGameInvitation(invitation, userService)).toList();

        return ResponseEntity.ok().body(responses);
    }

    public Board finishGame(long gameId, Optional<GameResults> gameResult)
    {
        synchronized(activeGames.get(gameId))
        {
            synchronized(activeBoards.get(gameId))
            {
                synchronized(disconnections.get(gameId))
                {
                    if(Arrays.asList(GameResults.ABANDONED, GameResults.WHITE_ABANDONED, GameResults.BLACK_ABANDONED).contains(gameResult.orElse(GameResults.NONE)))
                    {
                        activeBoards.get(gameId).setGameResult(gameResult.get());
                        chessGameRepository.deleteById(gameId);
                        activeGames.get(gameId).notifyAll();
                        activeBoards.get(gameId).notifyAll();
                        disconnections.get(gameId).notifyAll();
                        return activeBoards.get(gameId);
                    }
                    gameResult.ifPresent(gameResults -> activeBoards.get(gameId).setGameResult(gameResults));
                    chessGameRepository.updateGameResult(gameId, gameResult.orElse(activeBoards.get(gameId).getGameResult()));
                    if (activeGames.get(gameId).isRated())
                        activeBoards.replace(gameId, chessGameHelper.updateRatings(activeGames.get(gameId), activeBoards.get(gameId)));
                    activeGames.get(gameId).notifyAll();
                    activeBoards.get(gameId).notifyAll();
                    disconnections.get(gameId).notifyAll();
                    return activeBoards.get(gameId);
                }
            }
        }
    }

    public Board clearGame(long gameId)
    {
        synchronized(activeGames.get(gameId))
        {
            synchronized(activeBoards.get(gameId))
            {
                synchronized(disconnections.get(gameId))
                {
                    Board endBoard = activeBoards.get(gameId);
                    activeBoards.remove(gameId);
                    activeGames.remove(gameId);
                    disconnections.remove(gameId);
                    return endBoard;
                }
            }
        }
    }

    public Optional<ChessGame> getGameByEmail(String email)
    {
        String username = userRepository.findByEmail(email).get().getNameInGame();

        return activeGames.values().stream().filter(x -> x.getBlackUser().getNameInGame().equals(username) || x.getWhiteUser().getNameInGame().equals(username)).findFirst();
    }


    @Scheduled(fixedRate = 5000)
    public void handleGames()
    {
        List<Board> boards = activeBoards.values().stream().filter(x -> x.getMoves().size() < 2).toList();

        for(Board board : boards)
        {
           if(Instant.now().toEpochMilli() - board.getLastMoveTime() >= HelpMethods.getDisconnectionTime(board.getGameType()))
           {
//               finishGame(board.getGameId(), Optional.of(GameResults.ABANDONED));
//               clearGame(board.getGameId());
                 synchronized(disconnections.get(board.getGameId())) {
                     disconnections.get(board.getGameId()).notifyAll();
                 }
           }
        }
    }
}