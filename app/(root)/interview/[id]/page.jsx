import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getInterviewById, getServerUser } from '@/lib/config/server_actions';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async({params}) => {
    const {id} = await params;
    const interview = await getInterviewById(id);
    if(!interview) redirect('/');
    const user = await getServerUser();

  return (
    <>
        <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-row gap-4 items-center">
                    <Image src={getRandomInterviewCover()} alt="cover-image" width={40} height={40} className='rounded-full object-cover size-[40px]' />
                    <h3 className="capitalize">{interview.role} Interview</h3>
                </div>
                <DisplayTechIcons techStack={interview.techstack} />
            </div>
            <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize">
                {interview.type}
            </p>
        </div>

        <Agent userName={user?.name} userId={user?._id.toString()} type="interview" interviewId={id} questions={interview.questions} userPic={user?.image}/>
    </>
  )
}

export default page
