import type { Collection, Document } from "mongodb";
import { MongoClient } from "mongodb";

export default class MongoWrapepr {
  public static samples(): Collection {
    let client = new MongoClient("mongodb://157.90.236.62:27017");
    client.connect();

    const db = client.db("eas");

    const collection = db.collection("samples");

    return collection;
  }

  public static devices(): Collection {
    let client = new MongoClient("mongodb://157.90.236.62:27017");
    client.connect();

    const db = client.db("eas");

    const collection = db.collection("devices");

    return collection;
  }

  public static sampleCountSince(device: string, date: Date): Promise<number> {
    return this.samples().countDocuments({
      sampled_at: {
        $gte: date,
      },
      device,
    });
  }

  public static async lastDb(device: string) {
    return (
      await this.samples()
        .aggregate([
          {
            $match: {
              device: device,
            },
          },
          {
            $sort: {
              sampled_at: -1,
            },
          },
          {
            $limit: 1000,
          },
          {
            $project: {
              value: {
                $max: "$bands",
              },
            },
          },
          {
            $project: {
              value: {
                $divide: ["$value", 55],
              },
            },
          },
          {
            $project: {
              value: {
                $log10: "$value",
              },
            },
          },
          {
            $project: {
              value: {
                $multiply: ["$value", 180],
              },
            },
          },
          {
            $group: {
              _id: {},
              average: {
                $avg: "$value",
              },
            },
          },
        ])
        .toArray()
    )[0];
  }

  public static samplesAggregate(
    device: string,
    minutes: number
  ): Promise<Document[]> {
    return this.samples()
      .aggregate([
        {
          $match: {
            device,
          },
        },
        {
          $project: {
            max: {
              $max: "$bands",
            },
            sampled_at: "$sampled_at",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$sampled_at" },
              dayOfYear: { $dayOfYear: "$sampled_at" },
              hour: { $hour: "$sampled_at" },
              minute: { $minute: "$sampled_at" },
              second: {
                $subtract: [
                  {
                    $second: "$sampled_at",
                  },
                  {
                    $mod: [
                      {
                        $second: "$sampled_at",
                      },
                      5,
                    ],
                  },
                ],
              },
            },
            average: { $avg: "$max" },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: minutes,
        },
      ])
      .toArray();
  }

  public static samplesPer24Hours(device: string): Promise<Document[]> {
    return this.samples()
      .aggregate([
        {
          $match: {
            device,
          },
        },
        {
          $project: {
            max: {
              $max: "$bands",
            },
            sampled_at: "$sampled_at",
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$sampled_at",
              },
              dayOfYear: {
                $dayOfYear: "$sampled_at",
              },
              hour: {
                $hour: "$sampled_at",
              },
              minute: {
                $minute: "$sampled_at",
              },
            },
            average: {
              $avg: "$max",
            },
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 5,
        },
      ])
      .toArray();
  }
}
