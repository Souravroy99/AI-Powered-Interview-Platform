'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { vapi } from '@/lib/vapi.sdk'
import { saveMedicalSummary } from '@/lib/actions/general.action'

const CallStatus = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  CONNECTING: 'CONNECTING',
  FINISHED: 'FINISHED',
}

const Agent = ({ userName, userId }) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const onCallStart = () => {
      console.log('Call started')
      setCallStatus(CallStatus.ACTIVE)
    }

    const onCallEnd = async () => {
      console.log('Call ended')
      setCallStatus(CallStatus.FINISHED)
    }

    const onMessage = (message) => {
      if (
        message.type === 'transcript' &&
        message.transcriptType === 'final'
      ) {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        }

        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => {
      setIsSpeaking(true)
    }

    const onSpeechEnd = () => {
      setIsSpeaking(false)
    }

    const onError = (error) => {
      console.error('Vapi error:', error)
      setCallStatus(CallStatus.INACTIVE)
    }

    vapi.on('call-start', onCallStart)
    vapi.on('call-end', onCallEnd)
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallStart)
      vapi.off('call-end', onCallEnd)
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  }, [messages, userId])

  useEffect(() => {
    const saveConversation = async () => {
      if (
        callStatus === CallStatus.FINISHED &&
        messages.length > 0
      ) {
        try {
          const result = await saveMedicalSummary({
            userId,
            transcript: messages,
          })

          console.log(
            'Medical summary saved:',
            result
          )
        } catch (error) {
          console.error(
            'Failed to save medical summary:',
            error
          )
        }
      }
    }

    saveConversation()
  }, [callStatus, messages, userId])

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING)

      console.log(
        'Assistant ID:',
        process.env.NEXT_PUBLIC_MEDICAL_ASSISTANT_ID
      )

      await vapi.start(
        process.env.NEXT_PUBLIC_MEDICAL_ASSISTANT_ID
      )
    } catch (error) {
      console.error('Failed to start call:', error)
      setCallStatus(CallStatus.INACTIVE)
    }
  }

  const handleDisconnect = () => {
    try {
      vapi.stop()
    } catch (error) {
      console.error(error)
    }
  }

  const latestMessage =
    messages[messages.length - 1]?.content

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE ||
    callStatus === CallStatus.FINISHED

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image
              src='/robot.png'
              alt='Medical Assistant'
              width={110}
              height={120}
              className='object-cover'
            />

            {isSpeaking && (
              <span className='animate-speak'></span>
            )}
          </div>

          <h3>Medical Assistant</h3>
        </div>

        <div className='card-border'>
          <div className='card-content'>
            <Image
              src='/user-avatar.png'
              alt='User Avatar'
              width={540}
              height={540}
              className='object-cover rounded-full size-[120px]'
            />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p
              key={latestMessage}
              className='transition-opacity duration-500 opacity-0 animate-fadeIn opacity-100'
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className='justify-center flex w-full'>
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className='relative btn-call'
            onClick={handleCall}
          >
            <span
              className={`absolute animate-ping rounded-full opacity-75 ${
                callStatus !== CallStatus.CONNECTING
                  ? 'hidden'
                  : ''
              }`}
            />

            {isCallInactiveOrFinished ? (
              <span>Call</span>
            ) : (
              <span className='text-black'>
                . . . . .
              </span>
            )}
          </button>
        ) : (
          <button
            className='btn-disconnect'
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent