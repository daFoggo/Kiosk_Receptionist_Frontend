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
import { motion } from "framer-motion";
import ThirdHeader from "@/components/ThirdHeader/ThirdHeader";

// zod validation
const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(3).max(50),
});

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // check token to redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/identify-data");
    }
  }, [navigate]);

  // login
  const onSubmit = async (values: any) => {
    setError("");
    try {
      const response = await axios.post(ipLogin, values);
      localStorage.setItem("token", response.data["access_token"]);
      toast.success("Đăng nhập thành công");
      navigate("/admin/identify-data");
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
      <ThirdHeader
        title="Kiosk Manager"
        subText="Hệ thống quản lý thông tin Kiosk"
      />
      <ParticlesBackground />
      <main className="flex-grow flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-8 border rounded-2xl w-full max-w-md shadow-sm bg-white bg-opacity-90"
        >
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
        </motion.div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
