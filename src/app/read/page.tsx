"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

const Page = () => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPoints, setCustomerPoints] = useState<number | null>(null);
  const [inputPoints, setInputPoints] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);


  // const dummyData: Record<string, { name: string; points: number }> = {
  //   user123: { name: "山田 太郎", points: 500 },
  //   user456: { name: "佐藤 花子", points: 300 },
  // };

  const handleScan = async (decodedText: string) => {
    setScanning(false);
    setUserId(decodedText); 
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${decodedText}`);
      if (!res.ok) throw new Error("顧客が見つかりません");
  
      const data = await res.json();
      setCustomerName(data.name);
      setCustomerPoints(data.points);
      setResultMessage(""); // 成功したらメッセージ消す
    } catch (error) {
      console.error(error);
      setResultMessage("無効なQRコード、または顧客が見つかりません。");
      setCustomerName("");
      setCustomerPoints(null);
    }
  };
  
  const handleError = (errorMessage: unknown) => {
    console.error(errorMessage);
    setScanning(false);
  };

  const handleTransaction = async (type: "earn" | "use") => {
    if (!userId || customerPoints === null) {
      setResultMessage("顧客情報がありません。");
      return;
    }
  
    if (type === "use" && inputPoints > customerPoints) {
      setResultMessage("ポイントが不足しています。");
      return;
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/points/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          point: inputPoints,
          type, // "earn" or "use"
          store_id: 1, // ← 仮で固定、必要に応じて変数化
        }),
      });
      
      console.log({
        user_id: userId,
        store_id: 1,
        point: inputPoints,
        type
      });
  
      if (!res.ok) throw new Error("送信失敗");
  
      const data = await res.json();
      const newPoints = type === "earn"
        ? customerPoints + inputPoints
        : customerPoints - inputPoints;
      setCustomerPoints(newPoints);
      setResultMessage(data.message || `${inputPoints} ポイントを${type === "earn" ? "加算" : "減算"}しました。`);
    } catch (err) {
      console.error(err);
      setResultMessage("ポイント操作に失敗しました。");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-[430px] h-[732px] mx-auto border rounded-lg shadow-md bg-white">
      {scanning && (
         <div className="w-[320px] h-[320px] border-gray-500 flex items-center justify-center">
        <Scanner
          onScan={(codes) => {
            const result = codes[0]?.rawValue; // ← QRのテキスト取得
            if (result) {
              handleScan(result);
            }
          }}
          onError={handleError}
          constraints={{ facingMode: "environment" }}
          // classNames="w-full h-full"
          />
       </div>
      )}

      <input type="text" className="w-full p-2 border my-2 text-center" value={customerName} readOnly placeholder="顧客名表示" />
      <input type="text" className="w-full p-2 border my-2 text-center" value={customerPoints ?? ""} readOnly placeholder="保有ポイント表示" />
      <input type="number" className="w-full p-2 border my-2 text-center" value={inputPoints} onChange={(e) => setInputPoints(Number(e.target.value))} placeholder="加算 or 減算ポイント入力欄" />
      <div className="flex w-full gap-2">
        <button className="flex-1 bg-green-500 text-white p-2 rounded-lg" onClick={() => handleTransaction("earn")}>+</button>
        <button className="flex-1 bg-red-500 text-white p-2 rounded-lg" onClick={() => handleTransaction("use")}>-</button>
      </div>
      <input type="text" className="w-full p-2 border my-2 text-center" value={resultMessage} readOnly placeholder="処理結果表示" />
        <button
           className="mt-auto bg-blue-500 text-white p-2 w-full rounded-lg !mt-0"
           onClick={() => setScanning((prev) => !prev)}
           >
           スキャン
        </button>
    </div>
  );
};

export default Page;
