"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

const EventManagementClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventId = searchParams.get("eventId"); // クエリから eventId を取得
  
    // 仮のイベントデータ
    const events = [
      { id: "event1", name: "イベントA" },
      { id: "event2", name: "イベントB" },
      { id: "event3", name: "イベントC" },
    ];
  
    // イベント一覧画面（eventId がない場合）
    if (!eventId) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold mb-6 mt-5">イベント一覧</h1>
  
           {events.map((event) => (
            <button
              key={event.id}
              className="w-11/12 max-w-md p-4 mb-4 text-lg font-medium text-white bg-blue-500 rounded-xl shadow-md hover:bg-blue-700 transition"
              onClick={() => router.push(`/management?eventId=${event.id}`)}
            >
              {event.name}
            </button>
          ))}
        </div>
      );
    }
  
    // 選択されたイベントを取得
    const selectedEvent = events.find((event) => event.id === eventId);
  
    // 詳細画面（eventId がある場合）
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{selectedEvent?.name || "イベント詳細"}</h1>
          {selectedEvent && <QRCodeSVG value={selectedEvent.id} size={200} className="mb-4" />}
          <p className="text-lg">開催日時: 2025年3月20日</p>
          <p className="text-lg">紹介文: このイベントはとても楽しいです！</p>
          <p className="text-lg">タグ: #文化・歴史 #社会貢献 #エンタメ</p>
          <button
            onClick={() => router.push("/management")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            戻る
          </button>
        </div>
      </div>
    );
  };
  
  export default EventManagementClient;