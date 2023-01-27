import { Board } from "./Board";
import { User } from "./User";
import { BASE_URL, BOARD_ID } from "./config";
import { Api } from "./api";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

if (!BASE_URL || !BOARD_ID) {
  console.error("There was bad arguments to the script, expected <BASE_URL> <boardId>");
  process.exit(1);
}


async function main() {
  try {
    const [id, jwt] = await Api.loginAnonymously();

    if (!jwt) {
      console.error("Could not find JWT");
      process.exit(1);
    }

    const user = new User(id, jwt);
    const board = new Board(BOARD_ID);

    await Api.joinBoard(user.getJWT()); 
    board.setParticipant(user);

    const columns = await Api.getColumns(user.getJWT());
    board.setColumns(columns.map((column) => column.id));

    board.getColumns().forEach(async (column) => {
      for (let i = 0; i < 30; ++i) {
        await Api.createNote(
          user.getJWT(),
          column,
          `Note ${i}`
        );
      }
    });

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

