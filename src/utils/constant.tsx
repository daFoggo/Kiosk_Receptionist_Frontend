import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IdentifyData } from "@/types/IdentifyData";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

// identify data  column
export const identifyDataColumns: ColumnDef<IdentifyData>[] = [
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
    accessorKey: "b64",
    header: "Dữ liệu ảnh",
    cell: ({ row }) => {
      const imageData: string[] = row.getValue("b64");
      const [isOpen, setIsOpen] = useState(false);

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="text-center">
              Dữ liệu ảnh của {row.getValue("name")}
            </DialogTitle>
            <div className="flex items-center justify-center h-full">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {imageData?.map((base64, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={base64}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
