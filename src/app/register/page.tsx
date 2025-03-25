"use client";
import { useState } from "react";

const EventCreationPage = () => {
  const [formData, setFormData] = useState<{
    eventName: string;
    flyer: File | null;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    description: string;
    tags: string[];
  }>({
    eventName: "",
    flyer: null,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    tags: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, flyer: e.target.files![0] }));
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
    const store_id = 1;
    const form = new FormData();
    form.append("eventName", formData.eventName)
    // if (formData.flyer) {
    //   form.append("flyer", formData.flyer);
    // }
    // チラシのアップロードは一旦保留
    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);
    form.append("startTime", formData.startTime);
    form.append("endTime", formData.endTime);
    form.append("description", formData.description);
    formData.tags.forEach((tag) => form.append("tags[]", tag));
    form.append("timestamp", new Date().toISOString());
    form.append("store_id", store_id.toString());
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/event-register`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok)throw new Error("送信に失敗しました");

      const result = await res.json();
      alert(result.message);
    } catch(err){
      console.error("Error:",err);
      alert("送信に失敗しました")
    }


    console.log("Submitting event:", form);
  };

  const tagOptions = ["スポーツ", "文化・歴史", "グルメ", "エンタメ", "学び・体験", "社会貢献", "ライフスタイル"];

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">イベント名:</label>
        <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full p-2 border rounded mb-2" required />

        <label className="block mb-2">チラシアップロード (PDF):</label>
        <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" />

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

        <label className="block mb-2">タグ:</label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`p-2 border rounded ${formData.tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleTagChange(tag)}
            >
                {tag}
              </button>
            ))}
          </div>

        <button type="submit" style={{ display: 'block', margin: '20px auto', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' , width: '330px'}}>
          登録
        </button>
      </form>
    </div>
  );
};

export default EventCreationPage;
