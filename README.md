# Biosphere

Biosphere is a web application that calculates your carbon footprint, sorts your waste, and lets you report issues to your community.

## Inspiration

Since the theme for the hackathon was *Technology for social good*, I decided I should make an website that helps people around the world to make small changes to their lifestlye for the betterment of our planet. The website also serves as a community-driven platform that encourages citizens to report on local issues and volunteer to address them.

I wanted it to be simple yet powerful, adopting novel technologies such as artificial intelligence.

## Technology Stack

- SvelteKit
- Firebase
- Gemini
- Cloudflare

## Features

### Carbon Footprint Calculator

The carbon footprint calculator provides a means for people to estimate how much carbon dioxide they are emitting. It's meant to help people measure their progress as they make changes to their daily routine.

### Waste Sorter

Sorting waste is a cruical aspect when it comes to recycling. We can improve the efficiency of waste management if the public can easily sort their waste into different categories such as organic, recyclable, and landfill.

### Authentication System

The website not only serves content but also allows users to register accounts. This authentication measure was put in place to discourage users from spamming reports through the report page.

### Community Reports

Users can register an account and submit anonymous reports so that nearby volunteers can discover them. Volunteers within a 50 km distance of the incident location can then act on these reports.

## Challenges

Initially, I intended this project to be a mobile application. However, I had to move my idea to a web application because targeting mobile devices introduced many complications that would make the development of my product slow. Though, making a website still came with its own set of challenges.

### Database

This was my first time using Firebase, so it took me some time to navigate the documentation and get used to the Firebase ecosystem. My unfamiliarity with Firebase led me to run into bugs associated with **location filtering**. I spent many hours trying to debug why my geopoint queries weren't working but thanks to a Reddit post I was able to fix it.

### Time Constraint

I was not used to building a website within time constraints because I work on multiple hobby projects in parallel that usually span over months. Participating in this hackathon was a new experience for me as I couldn't code all the features I wanted in time. This was partly affected by my decision to do this solo.

## Achievements

A lot was achieved with this product. I was proud of how aesthetic and functional the website was. Some key milestones include:
- integrating computer vision for waste sorting
- creating a mathematical model for carbon footprint calculations
- adding an authentication system for users
- querying the database and filtering reports by location

## Future Potential

This project has lots of potential since the basic foundations for a full stack website have already been built. An authentication system and database have already been implemented which will allow additional features such as:
- gamification: reward volunteers
- discussions: allow locals to discuss and create public posts
- community projects: attract community members to support an initiative

## Learning Experience

As this is my first hackathon, I have to admit that I learnt many things in the process. It was my first time connecting a website to generative AI and using Firebase Authentication. I also had to do some prompt engineering when I was designing the waste sorter.