'use client';

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { Button, Col, Input, Row } from 'antd';
import { APP_DESC } from './constants';


const VALUE_STATEMENTS = [
  'We are a team of experienced professionals who are passionate about helping our clients achieve their goals.',
  'We are a team of experienced professionals who are passionate about helping our clients achieve their goals.',
  'We are a team of experienced professionals who are passionate about helping our clients achieve their goals.',
]


export default function Home() {
   return (
    <>

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
          <h1>{APP_DESC}</h1>
          <br/>
          <br/>
          {VALUE_STATEMENTS.map((statement, index) => {
            return (
              <p key={index} className='success-text'>
                {/* <CheckboxOutlined/> */}
                {statement}
              </p>
            )})
          }

          <Button size="large" className='standard-margin' type="primary" onClick={() => {
            window.location.href = '/optimize'
          }
          }>Get started</Button>&nbsp;
          

        </Col>
        <Col span={12}>

          <Image src="/logo.png" alt="Advisory Logo" width={180} height={37} /><br /><br />

        </Col>


      </Row>
    </>
  )
}
