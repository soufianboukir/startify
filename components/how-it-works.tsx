'use client'

import React from 'react'
import Lottie from 'lottie-react'
import LoginAnimation from '@/lotties/login-animation.json' // Replace with different animations as needed
import ExploreAnimation from '@/lotties/exploring-animation.json' // Replace with different animations as needed
import InteractionsAnimation from '@/lotties/interaction-animation.json' // Replace with different animations as needed
import IdeaPostingAnimation from '@/lotties/ideaPosting-animation.json' // Replace with different animations as needed
import FeedbackAnimation from '@/lotties/feedback-animation.json' // Replace with different animations as needed
import ValidateAnimation from '@/lotties/validate-animation.json' // Replace with different animations as needed

const steps = [
  {
    title: '1. Sign in',
    description:
      'To get started, simply log in to your account using your email and password or continue with google. This ensures your ideas are securely linked to your profile and allows you to track feedback, interact with other users, and manage your submissions etc...',
    animation: LoginAnimation,
  },
  {
    title: '2. Explore Ideas',
    description:
      'Browse a diverse collection of ideas shared by the community. This step lets you discover innovative projects, get inspired, and understand how other creators present their ideas effectively.',
    animation: ExploreAnimation,
  },
  {
    title: '3. Interact with Ideas',
    description:
      'Engage with ideas that interest you by upvoting to show support, leaving constructive comments to provide feedback, and following creators to stay updated. If necessary, report inappropriate content to help maintain a positive and safe community environment.',
    animation: InteractionsAnimation,
  },
  {
    title: '4. Post Your Idea',
    description:
      'Share your own idea by filling out a detailed form including a clear title, comprehensive description, relevant tags, and collaboration preferences. This allows others to understand your vision and contribute meaningful feedback or assistance.',
    animation: IdeaPostingAnimation,
  },
  {
    title: '5. Get Feedback and Engage',
    description:
      'Once your idea is live, you’ll receive comments, upvotes, and collaboration requests from the community. Real-time notifications help you stay connected so you can respond quickly, clarify points, and continuously improve your idea based on valuable input.',
    animation: FeedbackAnimation,
  },
  {
    title: '6. Validate and Launch',
    description:
      'After refining your idea, begin validating it with prototypes, surveys, or MVPs. Collect practical insights from real users who test your concept and offer detailed feedback, helping you make informed decisions before moving forward to full development or launch.',
    animation: ValidateAnimation,
  },
]

export const HowItWorks = () => {
  return (
    <section className="min-h-screen lg:px-[6%] md:px-8 px-5 py-10">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-semibold mb-4">How it works?</h1>
        <p className="font-medium text-gray-600 dark:text-gray-300">
          Get a clear understanding of how our platform helps you validate your ideas.
          Whether you{"'"}re sharing a SaaS concept, product feature, or business model,
          this section walks you through the journey—from posting your idea to gathering
          feedback and refining based on real insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
          >
            <Lottie animationData={step.animation} loop className="w-36 h-36 mb-4" />
            <h2 className="font-semibold text-xl mb-3">{step.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
