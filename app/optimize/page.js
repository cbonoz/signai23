'use client';

import Image from 'next/image'
import { useEffect, useState } from 'react';
import { generateEmail, getEmbedUrl, getRequests } from '../api';
import { Button, Input, Row, Col, Card, Table, Pagination, Divider, Switch } from 'antd';
import DisplayRequest from '../lib/DisplayRequest';
import { ArrowLeftOutlined, CopyOutlined } from '@ant-design/icons';
import { formatDate, isEmpty, parseError } from '../util';


export default function Optimize() {
    // https://developers.hellosign.com/api/reference/operation/signatureRequestGet/
    // const [signatureId, setSignatureId] = useState('580a47268c65e54acf062479b3d96b8b') // Should be unsigned signature id (signature id is signer specific).
    const [email, setEmail] = useState('');
    const [visibleEmail, setVisibleEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [result, setResult] = useState({})
    const [activeRequest, setActiveRequest] = useState(null)
    const [page, setPage] = useState(1)
    const [requests, setRequests] = useState([])
    const [error, setError] = useState(null)

    const copyToClipboard = async () => {
        // Check support
        if (!navigator.clipboard) {
            alert('Clipboard copy not supported on your browser')
            return
        }
        const text = result.text
        if ("clipboard" in navigator) {
            await navigator.clipboard.writeText(text);
        } else {
            document.execCommand("copy", true, text);
        }
        alert('Copied to clipboard')
    }

    const fetchData = async () => {
        if (!email) {
            return
        }

        setDataLoading(true)
        setError(null)

        try {
            const response = await getRequests(email, page)
            console.log('data', response)
            setRequests(response)
        } catch (error) {
            setError(parseError(error))
        } finally {
            setDataLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page]);

    const generate = async () => {
        setLoading(true)
        setError(null)

        try {
            const body = {
                signers: (activeRequest.signatures || []).map(s => s.signerName).join(','),
                documentContent: `${activeRequest.title}. ${activeRequest.message}`,
                context: '',
                requestId: activeRequest.signatureRequestId
            }
            const res = await generateEmail(body);
            setResult(res)
        } catch (error) {
            setError(parseError(error))
        } finally {
            setLoading(false)
        }
    }

    const hasRequests = !isEmpty(requests?.requests)

    return (
        <Row gutter={[16, 16]}>
            <Col sm={12} xs={24}>
                <Card title="Provide information">
                    <b>Email:</b>

                    <Input placeholder='Enter an email address associated with your Dropbox account'
                        type={visibleEmail ? 'text' : 'password'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} />

                    {activeRequest && <div>
                        {/* Back */}
                        <Button type="primary" className='standard-btn' onClick={() => setActiveRequest(null)}>
                            <ArrowLeftOutlined />&nbsp;Back
                        </Button>

                        {/* Render active request */}

                        <DisplayRequest request={activeRequest} />

                    </div>}

                    {!activeRequest && <div>
                        <br />
                        <Switch checked={visibleEmail} onChange={setVisibleEmail} />
                        <span>&nbsp;
                            {visibleEmail ? 'Hide' : 'Show'} email
                        </span>
                        <br />
                        <Button type="primary" className='standard-margin standard-btn' onClick={fetchData} disabled={loading || !email} loading={dataLoading}>Fetch data</Button>

                  
                        <Divider />

                     
                        {hasRequests && !activeRequest && <div>
                            <h3>Select a request to continue:</h3>
                            <br/>
                        </div>}

                        <Table
                            dataSource={requests.requests}
                            pagination={false}
                            className='pointer'
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: () => { setActiveRequest(record) }, // click row
                                };
                            }}
                            columns={[
                                {
                                    title: 'Signature Request Title',
                                    dataIndex: 'title',
                                    key: 'title',
                                    render: (text, record) => {
                                        return (
                                            <div key={record.signatureRequestId}>
                                                {/* abbreviate */}
                                                {text.substring(0, 50)}
                                            </div>
                                        )
                                    }
                                },
                                {
                                    title: 'Created At',
                                    dataIndex: 'createdAt',
                                    key: 'createdAt',
                                    render: (text, record) => {
                                        return (
                                            <div key={record.signatureRequestId}>
                                                {/* abbreviate */}
                                                {formatDate(record.createdAt)}
                                            </div>
                                        )
                                    }
                                },
                            ]} />
                        <br />
                        <Pagination onChange={
                            (p, pageSize) => {
                                console.log('page', p, pageSize)
                                setPage(p)
                            }
                        } pageSize={10} defaultCurrent={page} total={requests.numResults} />

                    </div>
                    }


                </Card>

            </Col>

            <Col sm={12} xs={24}>

                <div>
                    <Card title="Recommendation">
                        <div>
                            <Button type="primary" className='standard-btn' onClick={generate} disabled={loading || !activeRequest} loading={loading}>Generate email</Button>

                        </div>
                        <Divider />

                        {/* error */}
                        {error && <div>
                            <p className='error-text'>{error}</p>
                        </div>}

                        {/* Render result email recommendation with a copy as text */}
                        {result.text && <div>
                            <h2>Suggested Email Draft&nbsp;<CopyOutlined
                                className='pointer'
                                onClick={copyToClipboard}
                            />


                            </h2>

                            <div class="flex flex-col display-linebreak">
                                <div className='result-section'>
                                    {result.text}
                                </div>
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
