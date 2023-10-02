'use client';

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'antd';
import { APP_DESC } from './constants';
import { CheckCircleOutlined } from '@ant-design/icons';


const VALUE_STATEMENTS = [
  "Optimize your signature request process with AI-generated messaging.",
  "Deployed privately to your dropbox sign account",
  "Open source using GPT-3.5",
]


export default function Home() {
   return (
    <>
    <br/>
    <br/>
    <br/>

      <Row gutter={{
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32
      }} style={{
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '0 20px'
      }}>
        <Col span={12}>
          <div className='hero-slogan bold' >{APP_DESC}</div>
          <br/>
          <br/>
          <div className='value-section'>
          {VALUE_STATEMENTS.map((statement, index) => {
            return (
              <p key={index} className='success-text'>
                {/* <CheckboxOutlined/> */}
                <CheckCircleOutlined />&nbsp;
                {statement}
              </p>
            )})
          }
</div>

          <Button size="large" className='standard-margin' type="primary" onClick={() => {
            window.location.href = '/optimize'
          }
          }>Get started</Button>&nbsp;
          

        </Col>
        <Col span={12}>

          <Image src="/logo_3_2.png" alt="Advisory Logo" width={600} height={400} /><br /><br />

        </Col>


      </Row>
    </>
  )
}
