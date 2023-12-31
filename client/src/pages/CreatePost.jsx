import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        prompt: "",
        photo: "",
        photogeneratetime: "",
    });
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await axios.post(
                    "https://stablediffusionapi.com/api/v3/text2img",
                    {
                        key: "KksbKrigQdIXHe2pkntmlW5bo0xOkG72Moa1zaTgyxWvNybKjv5SLTCTwyrH",
                        prompt: form.prompt,
                        negative_prompt:
                            "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs))",
                        width: "1024",
                        height: "768",
                        samples: "1",
                        num_inference_steps: "20",
                        safety_checker: "no",
                        enhance_prompt: "yes",
                        seed: null,
                        guidance_scale: 7.5,
                        webhook: null,
                        track_id: null,
                    }
                );
                console.log(response);
                setForm({
                    ...form,
                    photo: `${response.data.output[0]}`,
                    photogeneratetime: response.data.generationTime,
                });
            } catch (error) {
                alert(error);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert("Please provide proper prompt");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.prompt && form.photo) {
            setLoading(true);

            try {
                const response = await fetch(
                    "http://localhost:8080/api/v1/post",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ...form }),
                    }
                );
                await response.json();
                navigate('/');
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false);
            }
        } else {
            alert('please give me a prompt')
        }
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    };

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">
                    ساختن عکس جدید
                </h1>
                <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
                یک تصویر تخیلی از طریق هوش مصنوعی ایجاد کنید و آن را با جامعه به اشتراک بگذارید
                </p>
            </div>
            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="نام شما"
                        type="text"
                        name="name"
                        placeholder="مثلا...,روح الله"
                        value={form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="متن مورد نظر خود را به زبان انگلیسی بنویسید تا نتیجه مطلوب تری حاصل شود."
                        value={form.prompt}
                        handleChange={handleChange}
                        isSupriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />
                    <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-128 p-3 h-128 flex justify-center items-center">
                        {form.photo ? (
                            <img
                                src={form.photo}
                                alt={form.prompt}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="preview"
                                className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}

                        {generatingImg && (
                            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader />
                            </div>
                        )}
                    </div>
                    {form.photogeneratetime ? (
                        <span className="text-[#666e75]">
                            زمان تولید عکس : {form.photogeneratetime} ثانیه
                        </span>
                    ) : (
                        <span></span>
                    )}
                </div>
                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatingImg ? "در حال تولید ..." : "تولید کردن"}
                    </button>
                </div>
                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">
                    ** هنگامی که تصویر مورد نظر خود را ایجاد کردید، می توانید آن را با سایرین در انجمن به اشتراک بگذارید **
                    </p>
                    <button
                        type="submit"
                        className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {loading ? "در حال انتشار..." : "انتشار در وبسایت"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreatePost;
