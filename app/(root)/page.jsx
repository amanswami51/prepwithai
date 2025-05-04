import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InterviewCard from '@/components/InterviewCard'
import { getInterviewsByUserID, getLetestInterviews, getServerUser } from '@/lib/config/server_actions'

const page = async() =>{
  const user = await getServerUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserID(user?._id.toString()),
    await getLetestInterviews({userId:user?._id.toString()})
  ]); 
  
  const hasPastInterviews = userInterviews?.length > 0;//Interviews which are created by us.
  const hasUpcomingInterviews = latestInterviews?.length > 0;//Interviews which are created by another users.

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice on real interview questions & get instant feedback
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href='/interview'>Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robot image' width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interview</h2>
        <div className="interviews-section">
          { 
            hasPastInterviews ? (
              userInterviews.map((interview)=>(
                <InterviewCard {...interview} key={interview._id}/>
              ))
            ) : (<p>You haven't taken any interviews yet</p>)
          }
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          { 
            hasUpcomingInterviews ? (
              latestInterviews.map((interview)=>(
                <InterviewCard {...interview} key={interview._id}/>
              ))
            ) : (<p>There are no new interviews available</p>)
          }
        </div>
      </section>
    </>
  )
}

export default page
