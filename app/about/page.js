'use client';

import { APP_DESC, APP_NAME, GITHUB_URL } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState()

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p className="text-bold">
                <Image src="/logo.png" alt="Advisory Logo" width={180} height={37} /><br /><br />
                {APP_NAME} | {APP_DESC}.
            </p>

            <p>
                Creating the signature request is only one part of the effort when using Dropbox/Hellosign.
            </p>
            <p>

                The second half is actually collecting the signature, and this can often be greatly influenced by the messaging that goes along with the request. Templates exist for sending messages, but often won't be tailored to the individual or the context, and using the right language can be key to an agreement pushing ahead.

            </p>
            <p>
                Advisory is created as a free / hostable app that uses your Dropbox API key to enable your team to create better crafted messages.
            </p>

            <Divider/>

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href={GITHUB_URL} target="_blank">GitHub</a>&nbsp;
            </p>
            <p>
                {/* Create listing */}
                <Button type="primary" onClick={() => {
                    router.push('/optimize')
                }}>Optimize messaging</Button>&nbsp;
            </p>

            <Divider />


        </div>
    )
}