Hello,

This is a bare-bones version of a client that would work with the service in the sample.

I used a Login Activity template for the ContosoLoginActivity class. Because of this, there's a lot of code that, since it's useful for a full-fledged login experience, it makes it hard to find the relevant code for the sample.

You can find the relevant code that signs in users to Contoso in the **doInBackground** method of the **ContosoLoginActivity.UserLoginTask**.

After the user signs in to Contoso, the app saves the Contoso user token to the storage in the device (shared preferences).

After signing in, the app launches **ContosoMenuActivity**. This class displays the possible actions that the user could perform with the app. As of now, it just displays a *Journal* button. Here is the subsequent flow of the app:

1. User clicks **Journal** button.
2. The **onJournalClick** event handler calls the **getJournalData** method.
3. **getJournalData** sends a *GET* request to the *http://localhost:3000/graph/getJournal* endpoint (getJournal endpoint).
4. The getJournal endpoint looks for an access token to make an authenticated request to Microsoft Graph. Since this is the first the sample runs, there's no such access token. The service sends an HTTP status 302 to the **deliverError** method.
5. The **deliverError** method detects the 302 code and launches the **MicrosoftSignInActivity**, which displays the *http://localhost:3000/connect* endpoint and attaches the Contoso user token to the **u-token** header in the request.
6. User signs in to Microsoft. The **MicrosoftSignInActivity** watches the URLs loaded using the **onPageFinished** method. When the *http://localhost:3000/token* URL is loaded, we know the authentication has ended, so the activity returns control to **ContosoMenuActivity**.
7. **ContosoMenuActivity** regains control in its **onActivityResult** method.
8. **onActivityResult** proceeds to call **getJournalData** method again, only that this time, the service should have an access token ready.
9. If everything goes well, we should receive the response in the **parseNetworkResponse** method.