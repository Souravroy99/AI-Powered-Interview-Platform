import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getUniqueInterviewById } from '@/lib/actions/general.action'
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({ params }: RouteParams) => {
    const { id } = await params ;
    const user = await getCurrentUser() ;
    const interview = await getUniqueInterviewById(id) ;

    if(!interview) redirect('/')

  return (
    <>
        <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row gap-4 items-center max-sm:flex-col">
                <div className="flex flex-row gap-4 items-center">
                    <Image src={getRandomInterviewCover()} alt='Cover Image' width={40} height={40} className='rounded-full object-cover size-[40px]'/>
                    <h3 className='capitalize'>{interview.role} Interview</h3>
                </div>

                <DisplayTechIcons techStack={interview.techstack} />
            </div>    
            <p className='bg-dark-200 py-2 px-4 text-xl rounded-lg capitalize h-fit'>{interview.type}</p>
        </div>  

        <Agent userName={user?.name} userId={user?.id} interviewId={id} type="interview" questions={interview.questions}/>
    </>
  )
}

export default page