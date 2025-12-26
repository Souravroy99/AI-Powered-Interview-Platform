'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';

const CallStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
  CONNECTING: "CONNECTING",
  FINISHED: "FINISHED"
};

const Agent = ({ userName, userId, type, interviewId, questions }) => {
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE)
  const [messages, setMessages] = useState([])
  const callActive = useRef(true)

  useEffect(() => {
    const onCallStart = () => {
      // callActive.current = true
      setCallStatus(CallStatus.ACTIVE)
    }

    const onCallEnd = () => {
      // callActive.current = false
      setCallStatus(CallStatus.FINISHED)
    }

    const onMessage = (message) => {
      // if (!callActive.current) return

      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = {
          role: message.role,
          content: message.transcript
        }
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => {
      // if (callActive.current) 
        setIsSpeaking(true)
    }

    const onSpeechEnd = () => {
      // if (callActive.current) 
        setIsSpeaking(false)
    }

    const onError = (error) => {
      console.log('Vapi error:', error)
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
  }, [])


  const handleGenerateFeedback = async (messages) => {
    console.log(`Generate feedback.`)

    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId,
      userId: userId,
      transcript: messages
    })

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log(`Error saving feedback`);
      router.push('/')
    }
  }

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/');
      } 
      else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId])


  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)

    if (type === 'generate') {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
        variableValues: {
          username: userName,
          userid: userId,
        }
      })
    } 
    else 
    {
      let formattedQuestions = '';
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join(`\n`)
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions
        }
      })
    }
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
    callActive.current = false

    try {
      vapi.stop()
    } catch (err) {
      console.warn('Call already ended or failed to stop:', err.message)
    }
  }

  const latestMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished =
                        callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image src="/robot.png" alt='Vapi' width={110} height={120} className='object-cover' />
            {isSpeaking && <span className='animate-speak'></span>}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className='card-border'>
          <div className='card-content'>
            <Image
              src="/user-avatar.png"
              alt='User Avatar'
              width={540}
              height={540}
              className='object-cover rounded-full size-[120px]'
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {
        messages.length > 0 && (
          <div className="transcript-border">
            <div className="transcript">
              <p
                key={latestMessage}
                className={cn(
                  'transition-opacity duration-500 opacity-0',
                  'animate-fadeIn opacity-100'
                )}
              >
                {latestMessage}
              </p>
            </div>
          </div>
      )}

      <div className='justify-center flex w-full'>
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call' onClick={handleCall}>
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            
            {
              isCallInactiveOrFinished 
              ?  (<span>Call</span>) 
              :  (<span className='text-black'>. . . . .</span>)
            }
          </button>
        ) : (
          <button className='btn-disconnect' onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent