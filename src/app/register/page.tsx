"use client";
import { useEffect, useState } from "react";

const EventCreationPage = () => {
  const [formData, setFormData] = useState<{
    eventName: string;
    flyer: File | null;
    eventImage: File | null;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    description: string;
    information: string;
    tags: string[];
    store_id: number; 
  }>({
    eventName: "",
    flyer: null,
    eventImage: null, 
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    information: "",
    tags: [],
    store_id: 1, // デフォルト値
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [availableTags, setAvailableTags] = useState<{ tag_id: number, tag_name: string }[]>([]);

  useEffect(()=> {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/tags`);
        const data = await res.json();
        console.log(data);
        setAvailableTags(data);
      } catch (err) {
        console.error("タグの取得に失敗しました", err);
      }
    };
    fetchTags();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // フライヤー用のハンドラー
  const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Flyer selected:", e.target.files[0].name);
      setFormData((prev) => ({ ...prev, flyer: e.target.files![0] }));
    }
  };

  // イベントイメージ用のハンドラー
  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Event image selected:", e.target.files[0].name);
      setFormData((prev) => ({ ...prev, eventImage: e.target.files![0] }));
    }
  };

  const handleTagChange = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    console.log("Form submission - Files selected:", {
      flyer: formData.flyer ? formData.flyer.name : "None",
      eventImage: formData.eventImage ? formData.eventImage.name : "None"
    });

    try {

      const submitData = new FormData();

      submitData.append("eventName", formData.eventName)
      if (formData.flyer) {
        submitData.append("flyer", formData.flyer);
      }
      if (formData.eventImage) {
        submitData.append("eventImage", formData.eventImage);
      }
      submitData.append("startDate", formData.startDate);
      submitData.append("endDate", formData.endDate);
      submitData.append("startTime", formData.startTime);
      submitData.append("endTime", formData.endTime);
      submitData.append("description", formData.description);
      submitData.append("information", formData.information);
      formData.tags.forEach((tag) => submitData.append("tags[]", tag));
      submitData.append("timestamp", new Date().toISOString());
      submitData.append("store_id", formData.store_id.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/event-register`, {
        method: 'POST',
        body: submitData,
      });
      
      if (!res.ok)throw new Error("送信に失敗しました");

      const result = await res.json();
      console.log("API Response:", result);
      setMessage(result.message || "イベントが登録されました");
      alert(result.message);

      setFormData({
        eventName: "",
        flyer: null,
        eventImage: null,
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        information: "",
        tags: [],
        store_id: 1,
      });


    } catch(err){
      console.error("Error:",err);
      alert("送信に失敗しました")
    } finally {
      setIsSubmitting(false);
    }

    console.log("Submitting event:", formData);
  };

  const tagOptions = ["スポーツ", "文化・歴史", "グルメ", "エンタメ", "学び・体験", "社会貢献", "ライフスタイル"];

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">イベント名:</label>
        <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">チラシアップロード (PDF/画像):</label>
        <div className="mb-2">
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFlyerChange} 
            className="w-full p-2 border rounded" 
          />
          {formData.flyer && (
            <div className="mt-1 text-sm text-green-600">
              選択済み: {formData.flyer.name}
            </div>
          )}
        </div>

        <label className="block mb-2">イベントイメージ (.jpg/.jpeg/.png):</label>
        <div className="mb-2">
          <input 
            type="file" 
            accept=".jpg,.jpeg,.png" 
            onChange={handleEventImageChange} 
            className="w-full p-2 border rounded" 
          />
          {formData.eventImage && (
            <div className="mt-1 text-sm text-green-600">
              選択済み: {formData.eventImage.name}
            </div>
          )}
        </div>
        <label className="block mb-2">開始日:</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">終了日:</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required/>

        <label className="block mb-2">開始時間:</label>
        <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">終了時間:</label>
        <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">イベント紹介:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">Happy Smile Point インフォメーション:</label>
        <textarea name="information" value={formData.information} onChange={handleInputChange} placeholder="特別なお知らせを入力してください。" className="w-full p-2 border rounded mb-2" required />


        <label className="block mb-2">タグ:</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              type="button"
              key={tag.tag_id}
              className={`p-2 border rounded ${
                formData.tags.includes(String(tag.tag_id)) ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => handleTagChange(String(tag.tag_id))}
            >
              {tag.tag_name}
            </button>
          ))}
        </div>

        <button type="submit" style={{ display: 'block', margin: '20px auto', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' , width: '330px'}}>
          登録
        </button>
        {message && (
          <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded text-green-700">
            {message}
          </div>
        )}
        {isSubmitting && (
          <div className="mt-4 text-center">
            <p className="text-blue-500">送信中...</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EventCreationPage;
