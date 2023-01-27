import { BASE_URL, BOARD_ID } from "./config";

function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
}

function extractJWT(response: Response) {
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const jwt = setCookie.split(";")[0].split("=")[1];
    return jwt;
  }
  return undefined;
}

export const Api = {
  async loginAnonymously() {
    try {
      const response = await fetch(`http://${BASE_URL}/login/anonymous`, {
        method: "POST",
      body: JSON.stringify({ name: "Stan" }),
      credentials: "include",
      });
      handleErrors(response);
      const jwt = extractJWT(response);
      const data = await response.json();
      return [data.id, jwt];
    } catch (e) {
      throw new Error("Unable to login in anonymously");
    }
  },
  async joinBoard(jwt: string) {
    try {
      const headers = new Headers();
      headers.set("Cookie", `jwt=${jwt}`);
      const response = await fetch(`http://${BASE_URL}/boards/${BOARD_ID}/participants`, {
        method: "POST",
      headers
      });
      handleErrors(response);
      return true;
    } catch (e) {
      throw new Error("Unable to join board");
    }
  },
  async getColumns(jwt: string) {
    try {
      const headers = new Headers();
      headers.set("Cookie", `jwt=${jwt}`);
      const response = await fetch(`http://${BASE_URL}/boards/${BOARD_ID}/columns`, {
        method: "GET",
      headers,
      });
      handleErrors(response);
      return await response.json() as [{id: string}];
    } catch (e) {
      throw new Error("Unable to get columns");
    }
  },
  async createNote(jwt: string, columnId: string, text: string) {
    try {
      const headers = new Headers();
      headers.set("Cookie", `jwt=${jwt}`);
      const response = await fetch(`http://${BASE_URL}/boards/${BOARD_ID}/notes`, {
        method: "POST",
      headers,
      body: JSON.stringify({ column: columnId, text })
      });
      handleErrors(response);
    } catch (e) {
      throw new Error("Unable to create note");
    }
  }
}
