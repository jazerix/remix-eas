import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

export default class MongoWrapepr {
  public static samples(): Collection {
    let client = new MongoClient("mongodb://localhost:27017");
    client.connect();

    const db = client.db("eas");

    const collection = db.collection("samples");

    return collection;
  }

  public static devices(): Collection {
    let client = new MongoClient("mongodb://localhost:27017");
    client.connect();

    const db = client.db("eas");

    const collection = db.collection("devices");

    return collection;
  }
}
