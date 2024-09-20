import { ColumnDef } from "@tanstack/react-table";
import { UserData } from "@/types/UserData";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const userDataColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "name",
    header: "Họ và tên",
  },
  {
    accessorKey: "identity_code",
    header: "Mã căn cước",
  },
  {
    accessorKey: "role",
    header: "Vai trò",
  },
  {
    accessorKey: "dob",
    header: "Ngày sinh",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
  },
  {
    accessorKey: "image_data",
    header: "Dữ liệu ảnh",
    cell: ({ row }) => {
      const imageData: string[] = row.getValue("image_data");
      
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {imageData.map((base64, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={`data:image/jpeg;base64,${base64}`}
                      alt={`Image ${index + 1}`}
                      className="w-full h-auto"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </PopoverContent>
        </Popover>
      );
    },
  },
];