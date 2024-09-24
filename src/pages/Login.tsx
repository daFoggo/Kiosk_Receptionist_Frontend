import { BotMessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ipLogin } from "@/utils/ip";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "@/components/ui/particles-background";
import { Toaster } from "sonner";

// zod validation
const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(3).max(50),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // check token to redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // login
  const onSubmit = async (values: any) => {
    setError("");
    try {
      const response = await axios.post(ipLogin, values);
      localStorage.setItem("token", response.data["access_token"]);
      toast.success("Đăng nhập thành công");
      navigate("/admin/dashboard");
    } catch (error: any) {
      if (error.response.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau");
      }
      toast.error("Đăng nhập thất bại");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <header className="px-6 py-3 flex gap-2 items-center font-clash text-2xl relative z-10">
        <div className="bg-base p-2 rounded-lg w-max h-max">
          <BotMessageSquare />
        </div>
        <div className="flex flex-col text-left">
          <h1>Kiosk Manager</h1>
          <p className="text-xs font-sans font-semibold">
            Quản lý thông tin Kiosk
          </p>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center relative z-10">
        <div className="p-8 border rounded-2xl w-full max-w-md shadow-sm bg-white bg-opacity-90">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <h1 className="text-3xl font-clash font-semibold text-center">
                Đăng nhập
              </h1>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tên đăng nhập"
                        {...field}
                        required
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        {...field}
                        required
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <FormMessage className="text-red-500">{error}</FormMessage>
              )}
              <Button type="submit">Đăng nhập</Button>
            </form>
          </Form>
        </div>
      </main>
      <Toaster
        position="top-center"
      />
    </div>
  );
};

export default Login;
