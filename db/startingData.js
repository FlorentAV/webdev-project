
// Some stock data to insert when the app runs
module.exports = {
    roles: [
        { role_name: 'admin' },
        { role_name: 'user' },
        { role_name: 'editor' }
    ],
    users: [
        { name: 'Admin', password: '123', role_id: 1 }, // Admin login
    { name: 'Bob', password: '123', role_id: 2 },
    { name: 'Charlie', password: '123', role_id: 2 },
    { name: 'Diana', password: '123', role_id: 2 },
    { name: 'Ethan', password: '123', role_id: 2 },
    { name: 'Fiona', password: '123', role_id: 3 },
    { name: 'George', password: '123', role_id: 2 },
    { name: 'Hannah', password: '123', role_id: 2 },
    { name: 'Isaac', password: '123', role_id: 3 },
    { name: 'Jasmine', password: '123', role_id: 2 },
    { name: 'Kevin', password: '123', role_id: 2 },
    { name: 'Laura', password: '123', role_id: 2 },
    { name: 'Michael', password: '123', role_id: 2 },
    { name: 'Nina', password: '123', role_id: 2 },
    { name: 'Oliver', password: '123', role_id: 2 },
    { name: 'Paula', password: '123', role_id: 2 },
    { name: 'Quinn', password: '123', role_id: 2 }
    ],

    posts: [
        { user_id: 1, content: 'Welcome to the platform!', created_at: new Date(), comments: [
            { user_id: 2, content: 'Thanks for having me!', created_at: new Date() },
            { user_id: 3, content: 'Excited to be here!', created_at: new Date() }
        ]},
        { user_id: 2, content: 'This is my first post!', created_at: new Date(), comments: [
            { user_id: 1, content: 'Nice post!', created_at: new Date() },
            { user_id: 4, content: 'Welcome!', created_at: new Date() }
        ]},
        { user_id: 3, content: 'Learning how to follow users!', created_at: new Date(), comments: [] },
        { user_id: 4, content: 'Happy to be part of this community!', created_at: new Date(), comments: [
            { user_id: 5, content: 'Me too!', created_at: new Date() }
        ]},
        { user_id: 5, content: 'Looking forward to connecting with everyone!', created_at: new Date(), comments: [] },
        { user_id: 1, content: 'Just finished a great book!', created_at: new Date(), comments: [
            { user_id: 2, content: 'What book was it?', created_at: new Date() },
            { user_id: 3, content: 'I love reading!', created_at: new Date() }
        ]},
        { user_id: 2, content: 'Who else is watching the new series?', created_at: new Date(), comments: [
            { user_id: 1, content: 'I started it yesterday!', created_at: new Date() },
            { user_id: 4, content: 'So good so far!', created_at: new Date() }
        ]},
        { user_id: 3, content: 'Just tried a new recipe!', created_at: new Date(), comments: [
            { user_id: 1, content: 'I want to try it too!', created_at: new Date() },
            { user_id: 2, content: 'Share the recipe!', created_at: new Date() }
        ]},
        { user_id: 4, content: 'Feeling grateful today.', created_at: new Date(), comments: [
            { user_id: 5, content: 'What’s making you feel that way?', created_at: new Date() }
        ]},
        { user_id: 5, content: 'Planning a weekend trip!', created_at: new Date(), comments: [
            { user_id: 1, content: 'Where to?', created_at: new Date() },
            { user_id: 2, content: 'Sounds fun!', created_at: new Date() }
        ]},
        { user_id: 1, content: 'Let’s plan a group outing!', created_at: new Date(), comments: [
            { user_id: 2, content: 'I’m in!', created_at: new Date() },
            { user_id: 3, content: 'Count me too!', created_at: new Date() }
        ]},
        { user_id: 2, content: 'What’s everyone’s favorite movie?', created_at: new Date(), comments: [
            { user_id: 4, content: 'I love action movies!', created_at: new Date() },
            { user_id: 5, content: 'I prefer comedies!', created_at: new Date() }
        ]},
        { user_id: 3, content: 'Trying to get fit this month!', created_at: new Date(), comments: [
            { user_id: 1, content: 'You got this!', created_at: new Date() },
            { user_id: 2, content: 'Let’s do it together!', created_at: new Date() }
        ]},
        { user_id: 4, content: 'Just got a new pet!', created_at: new Date(), comments: [
            { user_id: 3, content: 'What kind of pet?', created_at: new Date() },
            { user_id: 5, content: 'That’s awesome!', created_at: new Date() }
        ]},
        { user_id: 5, content: 'Working on a personal project!', created_at: new Date(), comments: [
            { user_id: 1, content: 'Can’t wait to see it!', created_at: new Date() },
            { user_id: 2, content: 'Sounds interesting!', created_at: new Date() }
        ]},
        { user_id: 1, content: 'Had a great day out with friends!', created_at: new Date(), comments: [
            { user_id: 2, content: 'Sounds like fun!', created_at: new Date() },
            { user_id: 3, content: 'Wish I could have joined!', created_at: new Date() }
        ]}
    ],
    followers: [
        { follower_id: 1, followed_id: 2 },
        { follower_id: 1, followed_id: 3 },
        { follower_id: 2, followed_id: 4 },
        { follower_id: 2, followed_id: 5 },
        { follower_id: 3, followed_id: 1 },
        { follower_id: 4, followed_id: 2 },
        { follower_id: 5, followed_id: 3 }
    ],
    comments: [
        { post_id: 1, user_id: 2, content: 'Great post!' },
        { post_id: 1, user_id: 3, content: 'I totally agree!' },
        { post_id: 2, user_id: 1, content: 'Welcome!' },
        { post_id: 3, user_id: 2, content: 'Glad to see you here!' },
        { post_id: 1, user_id: 2, content: 'What a great start!' },
        { post_id: 1, user_id: 3, content: 'Can’t wait for more!' },
        { post_id: 2, user_id: 1, content: 'Keep it up!' },
        { post_id: 3, user_id: 2, content: 'This is awesome!' },
        { post_id: 4, user_id: 5, content: 'Loving the vibe!' },
        { post_id: 5, user_id: 4, content: 'Excited to connect!' },
        { post_id: 6, user_id: 2, content: 'Any recommendations?' },
        { post_id: 7, user_id: 1, content: 'I’ve heard great things!' },
        { post_id: 8, user_id: 3, content: 'Food pics please!' },
        { post_id: 9, user_id: 5, content: 'Sounds like a plan!' },
        { post_id: 10, user_id: 4, content: 'Count me in!' },
    ]

};