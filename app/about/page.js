'use client';

import { APP_DESC, APP_NAME,  GITHUB_URL } from "../constants";
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

            <p>
                <Image src="/logo.png" alt="Advisory Logo" width={180} height={37} /><br /><br />
                {APP_NAME} | {APP_DESC}
            </p>

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href={GITHUB_URL} target="_blank">GitHub</a>&nbsp;
            </p>

            <p></p>
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