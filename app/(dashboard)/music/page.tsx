"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Music } from "lucide-react";
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


import { formSchema } from "./constant";

const MusicPage = () => {
  const router = useRouter();
  
  const [music, setMusic] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form Values:", values); // Log form values for debugging
    
    try {
      setMusic(""); // Reset previous music
      const response = await axios.post("/api/music", {
        prompt: values.prompt, // Send the prompt to the backend
      });
  
      console.log("Response Data:", response.data); // Log the response data
  
      if (response?.data?.audio) {
        setMusic(response.data.audio); // Set the audio URL
      } else {
        alert("Audio generation failed.");
      }
  
      form.reset();
    } catch (error: any) {
      console.log("[ERROR]", error); // Log error for debugging
      
      if (error?.response?.status === 403) {
        alert("Access denied. Please check your subscription.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      router.refresh(); // Refresh page to reset state
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Our most advanced AI Music Generation model."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
                  <FormItem className="col-span-12 lg:col-span-10">
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
              <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {!music && !isLoading && <Empty label="Start typing to generate music." />}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music} />
            </audio>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPage;