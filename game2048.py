import streamlit as st
import random
import numpy as np

class Game2048:
    def __init__(self):
        self.board = [[0] * 4 for _ in range(4)]
        self.score = 0
        self.start_game()

    def start_game(self):
        self.add_new_tile()
        self.add_new_tile()

    def add_new_tile(self):
        empty_cells = [(r, c) for r in range(4) for c in range(4) if self.board[r][c] == 0]
        if empty_cells:
            r, c = random.choice(empty_cells)
            self.board[r][c] = 2 if random.random() < 0.9 else 4

    def merge_row_left(self, row):
        non_zero = [num for num in row if num != 0]
        new_row = []
        skip = False
        for i in range(len(non_zero)):
            if skip:
                skip = False
                continue
            if i + 1 < len(non_zero) and non_zero[i] == non_zero[i + 1]:
                new_row.append(non_zero[i] * 2)
                self.score += non_zero[i] * 2
                skip = True
            else:
                new_row.append(non_zero[i])
        return new_row + [0] * (4 - len(new_row))

    def move_left(self):
        for r in range(4):
            self.board[r] = self.merge_row_left(self.board[r])

    def move_right(self):
        for r in range(4):
            self.board[r] = self.merge_row_left(self.board[r][::-1])[::-1]

    def move_up(self):
        for c in range(4):
            col = self.merge_row_left([self.board[r][c] for r in range(4)])
            for r in range(4):
                self.board[r][c] = col[r]

    def move_down(self):
        for c in range(4):
            col = self.merge_row_left([self.board[r][c] for r in range(4)][::-1])[::-1]
            for r in range(4):
                self.board[r][c] = col[r]

    def check_game_over(self):
        for r in range(4):
            for c in range(4):
                if self.board[r][c] == 0:
                    return False
                if c < 3 and self.board[r][c] == self.board[r][c + 1]:
                    return False
                if r < 3 and self.board[r][c] == self.board[r + 1][c]:
                    return False
        return True

def render_board(game):
    colors = {
        0: "#CDC1B4",
        2: "#EEE4DA",
        4: "#EDE0C8",
        8: "#F2B179",
        16: "#F59563",
        32: "#F67C5F",
        64: "#F65E3B",
        128: "#EDCF72",
        256: "#EDCC61",
        512: "#EDC850",
        1024: "#EDC53F",
        2048: "#EDC22E",
    }
    for row in game.board:
        cols = []
        for value in row:
            bg_color = colors.get(value, "#3C3A32")
            cols.append(
                f"<div style='display:inline-block; width:100px; height:100px; text-align:center; vertical-align:middle; line-height:100px; background-color:{bg_color}; color:black; border:2px solid #333; border-radius:5px; font-size:24px; font-weight:bold;'>{value if value != 0 else ''}</div>"
            )
        st.markdown("".join(cols), unsafe_allow_html=True)

# Streamlit App
st.set_page_config(page_title="2048 Game", page_icon="🎲", layout="centered")
st.title("2048 Game")

if "game" not in st.session_state:
    st.session_state.game = Game2048()

st.sidebar.title("Controls")
move = st.sidebar.radio("Make a Move", ["Up", "Down", "Left", "Right"])
game = st.session_state.game

if st.sidebar.button("Restart Game"):
    st.session_state.game = Game2048()
    game = st.session_state.game

old_board = np.array(game.board)
if move == "Up":
    game.move_up()
elif move == "Down":
    game.move_down()
elif move == "Left":
    game.move_left()
elif move == "Right":
    game.move_right()

if not np.array_equal(old_board, game.board):
    game.add_new_tile()

render_board(game)
st.sidebar.markdown(f"### Score: {game.score}")

if game.check_game_over():
    st.sidebar.markdown("## Game Over! Restart to play again.")
