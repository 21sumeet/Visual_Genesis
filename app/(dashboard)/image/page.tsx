"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Download, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Empty } from "@/components/empty";
import  Heading  from "@/components/heading";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { amountOptions, formSchema, resolutionOptions } from "./constant";

const ImagePage = () => {
  const router = useRouter();
  
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   console.log(values);
  //   try {
  //     setImages([]);
  //     const response = await axios.post("/api/image", values);
  
  //     // Map the returned data to extract the URLs
  //     const urls = response.data.map((image: { url: string }) => image.url);
  //     setImages(urls);
  
  //     form.reset();
  //   } catch (error: any) {
  //     console.log("Error generating images:", error.message);
  //   } finally {
  //     router.refresh();
  //   }
  // };
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     setImages([]);
  //     const response = await axios.post("/api/image", values);
      
  //     console.log("API response:", response.data);
  
  //     // Extract URLs safely from the response
  //     const urls = response.data.map((item: { url: string }) => {
  //       if (typeof item?.url === 'string') {
  //         return item.url;
  //       }
  //       return null;
  //     }).filter(Boolean);
  
  //     console.log("Extracted URLs:", urls);
  //     setImages(urls);
      
  //     form.reset();
  //   } catch (error: any) {
  //     console.log("Error generating images:", error);
  //   } finally {
  //     router.refresh();
  //   }
  // };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      setImages([]); // Reset images
      // Make the API request
      const response = await axios.post("/api/image", values);
      // Filter and map response data to extract valid URLs
      const urls = response.data.filter((url: string) => typeof url === "string" && url.trim() !== "");
      console.log("Valid URLs:", urls)
      setImages(urls); // Update state with valid URLs
      form.reset();
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      router.refresh();
    }
  };
  
  
  return (
    <div>
      <Heading
        title="Image Generation"
        description="Our most advanced AI Image Generation model."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        {...field}
                        placeholder="Start typing here..."
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && <Empty label="Start typing to generate images." />}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {images.map((image, index) => (
              <Card key={index} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image src={image} fill alt="image" />
                </div>
                <CardFooter className="p-2">
                  <Button onClick={() => window.open(image)} variant="secondary" className="w-full">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;