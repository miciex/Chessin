package com.chessin.controller.api;

import com.chessin.controller.playing.ChessGameService;
import com.chessin.controller.requests.CancelPendingChessGameRequest;
import com.chessin.controller.requests.ListenForFirstMoveRequest;
import com.chessin.controller.requests.PendingChessGameRequest;
import com.chessin.controller.requests.SubmitMoveRequest;
import com.chessin.controller.responses.ChessGameResponse;
import com.chessin.model.playing.*;
import com.chessin.model.register.user.UserRepository;
import com.chessin.model.utils.Constants;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.apache.tomcat.util.bcel.Const;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
public class ChessGameController {
    private final ChessGameRepository chessGameRepository;
    private final ChessGameService chessGameService;
    private final UserRepository userRepository;

    private final ConcurrentHashMap<String, PendingChessGame> pendingGames = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, Board> activeBoards = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<Long, ChessGame> activeGames = new ConcurrentHashMap<>();

    @Transactional
    @PostMapping("/searchNewGame")
    public ResponseEntity<?> searchNewGame(@RequestBody PendingChessGameRequest request) throws InterruptedException {

//        if(pendingGames.containsKey(request.getEmail()))
//        {
//            return ResponseEntity.badRequest().body("User is already searching for a game.");
//        }

        PendingChessGame foundGame = chessGameService.searchNewGame(request, new ArrayList<>(pendingGames.values()));

        if(foundGame != null)
        {
            synchronized(pendingGames.get(foundGame.getUser().getEmail()))
            {
                pendingGames.get(foundGame.getUser().getEmail()).setOpponent(userRepository.findByEmail(request.getEmail()).get());

                ChessGame game = ChessGame.builder()
                        .startBoard(Constants.Boards.classicBoard)
                        .whiteStarts(true)
                        .whiteUser(foundGame.getUser())
                        .blackUser(userRepository.findByEmail(request.getEmail()).get())
                        .availableCastles(new int[]{0, 0, 0, 0})
                        .timeControl(foundGame.getTimeControl())
                        .increment(foundGame.getIncrement())
                        //.moves(new ArrayList<>())
                        .build();

                chessGameRepository.save(game);

                pendingGames.get(foundGame.getUser().getEmail()).setId(game.getId());

                activeBoards.put(game.getId(), Board.fromGame(game));
                activeGames.put(game.getId(), game);

                pendingGames.get(foundGame.getUser().getEmail()).notifyAll();

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game));
            }
        }

        PendingChessGame pendingChessGame = PendingChessGame.builder()
                .user(userRepository.findByEmail(request.getEmail()).get())
                .timeControl(request.getTimeControl())
                .increment(request.getIncrement())
                .bottomRating(request.getBottomRating())
                .topRating(request.getTopRating())
                .userRating(request.getUserRating())
                .build();

        pendingGames.put(request.getEmail(), pendingChessGame);

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

                ChessGame game = ChessGame.builder()
                        .id(pendingGames.get(pendingChessGame.getUser().getEmail()).getId())
                        .startBoard(Constants.Boards.classicBoard)
                        .whiteStarts(true)
                        .whiteUser(pendingChessGame.getUser())
                        .blackUser(pendingChessGame.getOpponent())
                        .availableCastles(new int[]{0,0,0,0})
                        .timeControl(pendingChessGame.getTimeControl())
                        .increment(pendingChessGame.getIncrement())
                        //.moves(new ArrayList<>())
                        .build();

                pendingGames.remove(pendingChessGame.getUser().getEmail());

                return ResponseEntity.ok().body(ChessGameResponse.fromChessGame(game));
            }
        }
    }

    @PostMapping("/cancelSearch")
    public ResponseEntity<?> cancelSearch(@RequestBody CancelPendingChessGameRequest request)
    {
        if(!userRepository.existsByEmail(request.getEmail()))
            return ResponseEntity.badRequest().body("User not found");

        if(pendingGames.get(request.getEmail()) != null)
            pendingGames.remove(request.getEmail());
        else
            return ResponseEntity.badRequest().body("No search found");

        return ResponseEntity.ok().body("Search cancelled");
    }

    @PostMapping("/listenForFirstMove")
    public ResponseEntity<?> listenForFirstMove(@RequestBody ListenForFirstMoveRequest request) throws InterruptedException {
        if(!activeBoards.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body("Game not found.");

        if(activeBoards.get(request.getGameId()).getMoves().size() > 0)
            return ResponseEntity.ok().body(activeBoards.get(request.getGameId()));

        synchronized(activeGames.get(request.getGameId()))
        {
            activeGames.get(request.getGameId()).wait(Constants.Application.waitForMoveTime);

            return ResponseEntity.ok().body(activeBoards.get(request.getGameId()));
        }
    }

    @PostMapping("/submitMove")
    public ResponseEntity<?> submitMove(@RequestBody SubmitMoveRequest request) throws InterruptedException {
        if(!activeBoards.containsKey(request.getGameId()))
            return ResponseEntity.badRequest().body("Game not found.");

        synchronized(activeGames.get(request.getGameId()))
        {
            Board board = activeBoards.get(request.getGameId());

            if(board.isWhiteTurn() && !board.getWhiteEmail().equals(request.getEmail())){
                return ResponseEntity.badRequest().body("It's not your turn.");
            }
            else if(!board.isWhiteTurn() && !board.getBlackEmail().equals(request.getEmail())){
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

            board = chessGameService.submitMove(request, board, activeGames.get(request.getGameId()));

            if(board.getGameResult() != GameResults.NONE)
            {
                activeBoards.replace(request.getGameId(), board);
                activeGames.get(request.getGameId()).setGameResult(board.getGameResult());
                activeGames.get(request.getGameId()).notifyAll();
                return ResponseEntity.ok().body(board);
            }

            activeBoards.replace(request.getGameId(), board);

            activeGames.get(request.getGameId()).notifyAll();

            activeGames.get(request.getGameId()).wait(Constants.Application.waitForMoveTime);

            if(activeBoards.get(request.getGameId()).getGameResult() != GameResults.NONE)
            {
                Board endBoard = activeBoards.get(request.getGameId());
                activeBoards.remove(request.getGameId());
                activeGames.get(request.getGameId()).setGameResult(endBoard.getGameResult());
                //chessGameRepository.save(activeGames.get(request.getGameId()));
                activeGames.remove(request.getGameId());
                return ResponseEntity.ok().body(endBoard);
            }

            return ResponseEntity.ok().body(activeBoards.get(request.getGameId()));
        }
    }
}