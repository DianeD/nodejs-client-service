/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

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
        //sessionKey: 'nodesample',
        scope: ['notes.readwrite', 'user.read', 'profile', 'offline_access']
    }
};