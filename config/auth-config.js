/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// module.exports = {
//     params: {
//         callbackUrl: 'http://localhost:3000/graph/callback',//'https://msgraphservice.azurewebsites.net/graph/callback',
//         appId: 'ac3932c2-5714-4eba-95f9-3af160890393',
//         appSecret: 'x6MS9KmhcP58S9DQXmKYnuL',
//         identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
//         authority: 'https://login.microsoftonline.com',
//         authorizeEndpoint: '/common/oauth2/v2.0/authorize',
//         tokenEndpoint: '/common/oauth2/v2.0/token',
//         responseType: 'code',
//         responseMode: 'query',
//         scope: 'notes.readwrite openid profile email offline_access'
//         //scope: ['notes.readwrite', 'openid', 'email', 'offline_access']
//     }
// };

module.exports = {
    creds: {        
        identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
        clientID: '4a42edf5-c38c-4c8b-b346-4db631a1aebb',
        clientSecret: 'nhPS9PKHG3NxBeeFrctcKkK',
        //redirectUrl: 'https://7384bc4b.ngrok.io/token',
        redirectUrl: 'http://localhost:3000/token',
        allowHttpForRedirectUrl: true,
        passReqToCallback: true,
        responseType: 'code',
        responseMode: 'query',
        validateIssuer: false,
        sessionKey: 'nodesample',
        scope: ['notes.readwrite', 'user.read', 'profile', 'offline_access']
    }
};