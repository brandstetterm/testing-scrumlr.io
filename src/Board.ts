import { User } from "./User";

export class Board {
  private readonly id: string;
  private columns: string[];
  private participant?: User;

  constructor(id: string) {
    this.id = id;
    this.columns = [];
  }

  getId() {
    return this.id;
  }

  setColumns(columns: string[]) {
    this.columns = columns;
  }

  getColumns() {
    return this.columns;
  }

  setParticipant(user: User) {
    this.participant = user;
  }

  getParticipant() {
    return this.participant;
  }


  async addNote(column: string, text: string) {
    if (!this.participant) {
      throw new Error("Participant required to join board first");
    }

    if (!this.columns.includes(column)) {
      throw new Error("Invalid column");
    }

    const headers = new Headers();
    headers.set('Cookie', `jwt=${this.participant.getJWT()}`);
    headers.set('Content-Type', 'application/json');
    const response = await fetch(`http://localhost:3000/boards/${this.id}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        column,
        text
      })
    });
    if (response.ok) {
      console.log("Note added");
    } else {
      console.error("Error adding note");
    }
  }
}
