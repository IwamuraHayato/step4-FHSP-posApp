import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/management">
            <button className="w-full p-4 bg-gray-500 text-white rounded-lg shadow-md"
             style={{ height: '200px',fontSize: '25px'  }} >イベント管理</button>
          </Link>
          <Link href="/register">
            <button className="w-full p-4 bg-gray-500 text-white rounded-lg shadow-md" 
             style={{ height: '200px',fontSize: '25px'  }} >イベント作成</button>
          </Link>
          <Link href="/read">
            <button className="w-full p-4 bg-gray-500 text-white rounded-lg shadow-md"
             style={{ height: '200px',fontSize: '25px'  }} >顧客QR読込</button>
          </Link>
          <button className="w-full p-4 bg-gray-500 text-white rounded-lg shadow-md"
           style={{ height: '200px',fontSize: '25px'  }}  disabled>
            ポイント管理
          </button>
        </div>
      </div>
    </div>
  );
}
