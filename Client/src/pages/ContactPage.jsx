import { Phone } from "lucide-react"; // Lucide icon
import { useForm } from "react-hook-form";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    alert("Đã gửi yêu cầu! Cảm ơn bạn.");
    reset();
  };

  return (
    <section className="max-w-5xl mx-auto py-12 px-2 md:px-6 flex flex-col md:flex-row gap-10 items-start">
      {/* Thông tin liên hệ bên trái */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700">Liên hệ</h2>
          <Phone className="w-8 h-8 text-blue-700" />
        </div>
        <p className="text-gray-700 text-lg leading-relaxed mt-2">
          Bạn cần liên hệ với chúng tôi? Hãy điền vào mẫu yêu cầu và chờ đợi phản hồi của chúng mình nha.
        </p>
      </div>

      {/* Form bên phải */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 bg-white rounded-xl shadow border border-gray-400 p-6 min-w-[320px] max-w-md"
        autoComplete="off"
      >
        <div className="mb-4">
          <label className="block font-bold mb-1">Họ và tên</label>
          <input
            {...register("name", { required: "Vui lòng nhập tên" })}
            className="w-full bg-blue-200/80 rounded-xl px-4 py-2 outline-none focus:bg-blue-100"
            placeholder="Nhập họ và tên"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">Email</label>
          <input
            {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" } })}
            className="w-full bg-blue-200/80 rounded-xl px-4 py-2 outline-none focus:bg-blue-100"
            placeholder="Nhập email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-1">Số điện thoại</label>
          <input
            {...register("phone")}
            className="w-full bg-blue-200/80 rounded-xl px-4 py-2 outline-none focus:bg-blue-100"
            placeholder="Nhập số điện thoại"
            type="tel"
          />
        </div>
        <div className="mb-6">
          <label className="block font-bold mb-1">Chúng tôi có thể giúp gì</label>
          <textarea
            {...register("message", { required: "Vui lòng nhập nội dung" })}
            className="w-full bg-blue-200/80 rounded-xl px-4 py-2 outline-none focus:bg-blue-100 min-h-[60px]"
            placeholder="Nội dung cần hỗ trợ"
            rows={3}
          />
          {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 rounded-xl text-lg shadow transition"
        >
          Gửi
        </button>
      </form>
    </section>
  );
}
