import { useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
      <input
        {...register("username", { required: "Username is required" })}
        placeholder="Username"
        className="border px-2 py-1 w-full"
      />
      {errors.username && <p className="text-red-500">{errors.username.message}</p>}

      <input
        {...register("password", { required: "Password is required" })}
        type="password"
        placeholder="Password"
        className="border px-2 py-1 w-full"
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
