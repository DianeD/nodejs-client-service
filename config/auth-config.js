/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

module.exports = {
    params: {
        identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
        appId: '0887ce25-8495-47ca-9394-eebf2fc00675',
        appSecret: 'FkK6sfAROUqXh0x2kA1dYeN',
        //redirectUrl: 'http://localhost:3000/graph/callback',
        redirectUrl: 'https://134163b3.ngrok.io/graph/callback',
        authority: 'https://login.microsoftonline.com',
        authorizeEndpoint: '/common/oauth2/v2.0/authorize',
        tokenEndpoint: '/common/oauth2/v2.0/token',
        responseType: 'code',
        responseMode: 'query',
        scope: 'openid notes.readwrite user.read profile offline_access'
    }
};

// module.exports = {
//     creds: {        
//         identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
//         clientID: '4a42edf5-c38c-4c8b-b346-4db631a1aebb',
//         clientSecret: 'nhPS9PKHG3NxBeeFrctcKkK',
//         redirectUrl: 'https://134163b3.ngrok.io/token',
//         // redirectUrl: 'http://localhost:3000/token',
//         // allowHttpForRedirectUrl: true,
//         passReqToCallback: true,
//         responseType: 'code',
//         responseMode: 'query',
//         validateIssuer: false,
//         sessionKey: 'nodesample',
//         scope: ['notes.readwrite', 'user.read', 'profile', 'offline_access']
//     }
// };