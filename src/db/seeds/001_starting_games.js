export async function seed(knex) {
  // Delete existing entries
  await knex('shelves').del();
  await knex('games').del();

  // Seed games table with realistic board game data
  await knex('games').insert([
    {
      title: "Catan",
      description: "Build settlements and cities on the island of Catan. Trade resources and use strategy to become the dominant force.",
      image_url: "/images/game-1.jpg",
      min_players: 3,
      max_players: 4,
      playtime_minutes: 90,
      rating: 4.3
    },
    {
      title: "Ticket to Ride",
      description: "Claim railway routes and connect cities across the board. Strategic route-blocking and resource management.",
      image_url: "/images/game-2.jpg",
      min_players: 2,
      max_players: 5,
      playtime_minutes: 60,
      rating: 4.2
    },
    {
      title: "Carcassonne",
      description: "Build a medieval landscape tile by tile. Claim features and score points as the world takes shape.",
      image_url: "/images/game-1.jpg",
      min_players: 2,
      max_players: 5,
      playtime_minutes: 45,
      rating: 4.0
    },
    {
      title: "Pandemic",
      description: "Work together as disease-fighting specialists to contain outbreaks and discover cures. Cooperative gameplay.",
      image_url: "/images/game-2.jpg",
      min_players: 2,
      max_players: 4,
      playtime_minutes: 45,
      rating: 4.2
    },
    {
      title: "7 Wonders",
      description: "Lead your civilization to glory through card drafting and building across three ages. Simultaneous action selection.",
      image_url: "/images/game-1.jpg",
      min_players: 3,
      max_players: 7,
      playtime_minutes: 45,
      rating: 4.3
    },
    {
      title: "Splendor",
      description: "Build a gem trading empire. Collect gems, purchase developments, and attract nobles for victory points.",
      image_url: "/images/game-2.jpg",
      min_players: 2,
      max_players: 4,
      playtime_minutes: 30,
      rating: 4.1
    },
    {
      title: "Dominion",
      description: "The original deck-building game. Draft cards and build powerful decks to dominate your opponents.",
      image_url: "/images/game-1.jpg",
      min_players: 2,
      max_players: 4,
      playtime_minutes: 30,
      rating: 4.0
    },
    {
      title: "Azul",
      description: "Beautiful tile-placement game about decorating the Royal Palace. Easy to learn, deep strategy.",
      image_url: "/images/game-2.jpg",
      min_players: 2,
      max_players: 4,
      playtime_minutes: 30,
      rating: 4.4
    },
    {
      title: "Blood Rage",
      description: "Viking clans battle for glory across three ages. Draft cards and send your warriors to gain fame and conquest.",
      image_url: "/images/game-1.jpg",
      min_players: 2,
      max_players: 4,
      playtime_minutes: 60,
      rating: 4.2
    },
    {
      title: "Everdell",
      description: "Build the prettiest woodland city. Gather resources, construct buildings, and attract cute critters.",
      image_url: "/images/game-2.jpg",
      min_players: 1,
      max_players: 4,
      playtime_minutes: 40,
      rating: 4.3
    }
  ]);
}
