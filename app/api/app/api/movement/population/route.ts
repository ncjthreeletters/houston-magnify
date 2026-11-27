
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JOIN_GROUP = "40703928003";
const MIN_GROUP_SIZE = 5;

const CITIES = [
  {
    id: "45014170003",
    name: "Sugar Land",
    coordinates: [-95.6349, 29.6197],
  },
  {
    id: "45014174003",
    name: "Missouri City",
    coordinates: [-95.5377, 29.6186],
  },
  {
    id: "45014175003",
    name: "Pearland",
    coordinates: [-95.2860, 29.5636],
  },
  {
    id: "45014176003",
    name: "Pasadena",
    coordinates: [-95.2091, 29.6911],
  },
  {
    id: "45014177003",
    name: "Spring",
    coordinates: [-95.4172, 30.0799],
  },
  {
    id: "45014178003",
    name: "Katy",
    coordinates: [-95.8244, 29.7858],
  },
];

type Group = {
  id: string;
  name: string;
  contactsCount: number;
};

export async function GET() {
  try {
    const username = process.env.EZTEXTING_USERNAME;
    const password = process.env.EZTEXTING_PASSWORD;

    if (!username || !password) {
      return NextResponse.json(
        { status: "configuration_required" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(
      `${username}:${password}`
    ).toString("base64");

    const groups: Group[] = [];
    let page = 0;

    while (true) {
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
        console.error("EZ Texting status:", response.status);
        throw new Error("EZ Texting request failed");
      }

      const data = await response.json();

      if (!Array.isArray(data.content)) {
        throw new Error("Invalid API response");
      }

      groups.push(...data.content);

      page++;

      if (data.last || page >= data.totalPages) break;
      if (page >= 20) throw new Error("Pagination limit");
    }

    const join = groups.find(
      (group) => group.id === JOIN_GROUP
    );

    if (!join) {
      throw new Error("Join group not found");
    }

    const communityTotal = join.contactsCount;

    const cityData = CITIES.map((city) => {
      const group = groups.find(
        (group) => group.id === city.id
      );

      if (!group) {
        throw new Error("Location group missing");
      }

      return {
        ...city,
        count: group.contactsCount,
      };
    })
      .filter((city) => city.count >= MIN_GROUP_SIZE);

    const highestCount = Math.max(
      1,
      ...cityData.map((city) => city.count)
    );

    // Convert private counts into five broad density levels.
    const cities = cityData
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

    // Reveal only broad community scale categories.
    const communityScale =
      communityTotal >= 5000 ? 5 :
      communityTotal >= 2000 ? 4 :
      communityTotal >= 1000 ? 3 :
      communityTotal >= 500 ? 2 : 1;

    return NextResponse.json(
      {
        status: "connected",
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

