'use client';

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { generateEmail, getEmbedUrl, getRequests } from '../api';
import { Button, Input, Row, Col, Card, Table } from 'antd';


export default function Optimize() {
    // https://developers.hellosign.com/api/reference/operation/signatureRequestGet/
    // const [signatureId, setSignatureId] = useState('580a47268c65e54acf062479b3d96b8b') // Should be unsigned signature id (signature id is signer specific).
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [result, setResult] = useState({})
    const [activeRequest, setActiveRequest] = useState(null)
    const [requests, setRequests] = useState([])
    const [error, setError] = useState(null)

    const copyToClipboard = () => {
        // Check support
        if (!navigator.clipboard) {
            alert('Clipboard copy not supported on your browser')
            return
        }
        navigator.clipboard.writeText(result.text)
        alert('Copied to clipboard')
    }

    const fetchData = async () => {
        if (!email) {
            alert('Please enter an email')
            return
        }

        setDataLoading(true)
        setError(null)

        try {
            const response = await getRequests(email);
            console.log('data', response)
            setRequests(response.requests)
        } catch (error) {
            setError(error)
        } finally {
            setDataLoading(false)
        }
    }

    const generate = async () => {
        setLoading(true)
        setError(null)

        try {
            const body = {
                signerName: activeRequest.signatures[0].signerName,
                documentContent: activeRequest.title,
                context: 'The signer is a lawyer and busy',
                requestId: activeRequest.signatureRequestId
            }
            const { data } = await generateEmail();
            setResult(data)
        } catch (error) {
            setError(error)
            setResult({
                text: 'Example recommended text',
                emailTo: 'test@example.com'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Card title="Provide information">

                    <Input placeholder='Email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        disabled={loading}/>

                    <Button type="primary" className='standard-btn' onClick={fetchData} disabled={loading} loading={dataLoading}>Fetch data</Button>    

                    {activeRequest && <div>
                        {/* Back */}
                        <Button type="primary" className='standard-btn' onClick={() => setActiveRequest(null)}>Back</Button>

                        {/* Render active request */}
                        {activeRequest.signatureRequestId}

                        {activeRequest.signatures.map((signature, index) => {
                            return (
                                <div key={index}>
                                    {signature.signerName}
                                </div>
                            )
                        })}

                        
                        </div>}

                    {!activeRequest && <Table
                        dataSource={requests}
                        onClick={(record) => setActiveRequest(record)}
                        columns={[
                            {
                                title: 'Title',
                                dataIndex: 'title',
                                key: 'title',
                            },
                        ]}/>}

                </Card>

            </Col>

            <Col span={12}>

                <div>
                    <Card title="Recommendation">
                        <div>
                            <Button type="primary" className='standard-btn' onClick={generate} disabled={loading} loading={loading}>Generate email</Button>
                        </div>

                        {/* error */}
                        {error && <div>
                            <p className='error-text'>{error.message}</p>
                        </div>}

                        {/* Render result email recommendation with a copy as text */}
                        {result && <div>
                            <h2>Result</h2>

                            <div class="flex flex-col">
                                {result.text}

                                <div class="flex flex-row">
                                    <Button type='primary' onClick={copyToClipboard} className='standard-btn'>
                                        Copy
                                    </Button>
                                    {result.emailTo && <Button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Email {result.emailTo}
                                    </Button>}
                                </div>
                            </div>
                        </div>}
                    </Card>
                </div>
            </Col>
        </Row>


    )
}
