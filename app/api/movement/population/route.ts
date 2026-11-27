
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JOIN_GROUP = "40703928003";
const MIN_GROUP_SIZE = 5;

const CITIES = [
  {
    name: "Sugar Land",
    id: "45014170003",
    coordinates: [-95.6349, 29.6197],
  },
  {
    name: "Missouri City",
    id: "45014174003",
    coordinates: [-95.5377, 29.6186],
  },
  {
    name: "Pearland",
    id: "45014175003",
    coordinates: [-95.2860, 29.5636],
  },
  {
    name: "Pasadena",
    id: "45014176003",
    coordinates: [-95.2091, 29.6911],
  },
  {
    name: "Spring",
    id: "45014177003",
    coordinates: [-95.4172, 30.0799],
  },
  {
    name: "Katy",
    id: "45014178003",
    coordinates: [-95.8244, 29.7858],
  },
  {
    name: "Other",
    id: "45014180003",
    coordinates: [-95.3698, 29.7604],
  },
];

export async function GET() {
  const username = process.env.EZTEXTING_USERNAME;
  const password = process.env.EZTEXTING_PASSWORD;

  if (!username || !password) {
    return NextResponse.json(
      { status: "configuration_required" },
      { status: 500 }
    );
  }

  try {
    const auth = Buffer.from(
      `${username}:${password}`
    ).toString("base64");

    const groups = new Map<string, number>();

    let page = 0;
    let totalPages = 1;

    do {
      const response = await fetch(
        `https://a.eztexting.com/v1/contact-groups?page=${page}&size=100`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("EZ Texting request failed");
      }

      const data = await response.json();

      if (!Array.isArray(data.content)) {
        throw new Error("Unexpected API response");
      }

      for (const group of data.content) {
        groups.set(
          String(group.id),
          Number(group.contactsCount ?? 0)
        );
      }

      totalPages = Number(data.totalPages ?? 1);
      page++;
    } while (page < totalPages && page < 20);

    if (!groups.has(JOIN_GROUP)) {
      throw new Error("Join group not found");
    }

    const communityCount = groups.get(JOIN_GROUP)!;

    const communityScale =
      communityCount >= 5000 ? 5 :
      communityCount >= 2000 ? 4 :
      communityCount >= 1000 ? 3 :
      communityCount >= 500 ? 2 : 1;

    const eligibleCities = CITIES.map((city) => ({
      ...city,
      count: groups.get(city.id) ?? 0,
    })).filter((city) => city.count >= MIN_GROUP_SIZE);

    const highestCount = Math.max(
      1,
      ...eligibleCities.map((city) => city.count)
    );

    const cities = eligibleCities
      .map((city) => ({
        name: city.name,
        coordinates: city.coordinates,
        intensity: Math.max(
          1,
          Math.ceil((city.count / highestCount) * 5)
        ),
      }))
      .sort(
        (a, b) =>
          b.intensity - a.intensity ||
          a.name.localeCompare(b.name)
      );

    return NextResponse.json(
      {
        status: "connected",
        communityCount,
        communityScale,
        cities,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { status: "temporarily_unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
