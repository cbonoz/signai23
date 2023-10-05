'use client';

import { usePathname } from "next/navigation"
import Link from "next/link";
import { APP_NAME, GITHUB_URL, HACKATHON_URL } from "../constants";
import { Button, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Image from "next/image";
import { GithubOutlined } from "@ant-design/icons";
import StyledComponentsRegistry from "../registry";

function UiLayoutWrapper({ children }) {

    const pathname = usePathname()

    const menuItems = [
        {
            key: '/',
            label: <Link href="/">Home</Link>,
            href: '/',
        },
        {
            key: '/optimize',
            label: <Link href="/optimize">Optimize</Link>,
            href: '/optimize',
        },
        {
            key: '/about',
            label: <Link href="/about">About</Link>,
            href: '/about',
        },
    ]

    // if (isAdmin) {
    //     menuItems.push({
    //         key: '/admin',
    //         label: <Link href="/admin">Admin</Link>,
    //         href: '/admin',
    //     })
    // }

    return (
        <StyledComponentsRegistry>

            <Layout>
                <Header style={{ background: '#fff', display: 'flex' }}>
                    <Image src="/logo.png" alt="Advisory Logo"
                        className='header-logo'
                        height={48}
                        onClick={() => {
                            window.location.href = '/'
                        }}
                        width={167}
                        />

                    <Menu style={{ minWidth: '800px' }}
                        mode="horizontal" defaultSelectedKeys={pathname} items={menuItems} />

                    <span style={{ float: 'right', right: 20, position: 'absolute' }}>
                        <a href={GITHUB_URL} target="_blank"> 
                        <GithubOutlined />&nbsp;Github
                        </a>
                    </span>


                </Header>
                <Content className='container'>
                    {/* Pass children to the content area */}
                    <div className='container'>
                        {children}
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    <hr />
                    <br />
                    {APP_NAME} ©2023. Created for the&nbsp;<a href={HACKATHON_URL} target="_blank">Dropbox Sign Hackathon 2023</a>.&nbsp;

                </Footer>
            </Layout>

        </StyledComponentsRegistry>
    )
}

export default UiLayoutWrapper