"use client";

import { useState } from "react";

type WeatherData = {
  name: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number };
};

export default function HomePage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Clothing Suggestion Engine
  const suggestClothing = (weather: WeatherData) => {
    const temp = weather.main.temp;
    const description = weather.weather[0].description.toLowerCase();

    if (description.includes("rain")) {
      return "☔ Rainy day — wear a waterproof jacket and carry an umbrella.";
    }

    if (description.includes("snow")) {
      return "❄️ Snowy weather — bundle up with a heavy coat, gloves, and boots.";
    }

    if (temp > 30) {
      return "🥵 Hot weather — wear light clothes, shorts, and sunglasses.";
    }

    if (temp > 20) {
      return "😎 Warm & pleasant — a T-shirt or light shirt works perfectly.";
    }

    if (temp > 10) {
      return "🧥 Cool day — wear a light jacket or hoodie.";
    }

    if (temp > 0) {
      return "🧣 Cold — wear a coat, scarf, and gloves.";
    }

    return "🥶 Freezing — heavy winter clothes, hat, scarf, and insulated boots are a must.";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-200 via-blue-50 to-indigo-200">
      <h1 className="text-5xl font-extrabold mb-8 text-blue-800 drop-shadow-lg">
        👕 Weather & Clothing Guide
      </h1>

      {/* Search Bar */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg shadow-sm"
        />
        <button
          onClick={getWeather}
          disabled={loading}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 font-medium bg-red-100 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Weather Card */}
      {weather && (
        <div className="mt-6 p-8 bg-white/80 backdrop-blur shadow-xl rounded-3xl w-96 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">
            {weather.name}
          </h2>
          <p className="capitalize text-gray-600 mb-2 text-lg">
            {weather.weather[0].description}
          </p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
            alt="Weather Icon"
            className="mx-auto drop-shadow-lg"
          />
          <p className="text-5xl font-extrabold text-gray-900 mb-2">
            {weather.main.temp}°C
          </p>
          <p className="text-md text-gray-500 mb-4">
            Feels like {weather.main.feels_like}°C • Humidity{" "}
            {weather.main.humidity}%
          </p>

          {/* 👕 Clothing Suggestion */}
          <p className="mt-4 text-green-700 font-semibold text-lg bg-green-50 p-3 rounded-xl shadow-sm">
            {suggestClothing(weather)}
          </p>
        </div>
      )}
    </main>
  );
}
