package com.microsoft.graph.hybrid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.HashMap;
import java.util.Map;

public class MicrosoftSignInActivity extends AppCompatActivity {
  private final String TAG = "MicrosoftSignInActivity";
  private WebView mAuthWebView;
  private String mContosoUserToken;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_microsoft_sign_in);

    mContosoUserToken = getSharedPreferences("ContosoConf", Context.MODE_PRIVATE).getString("ContosoUserToken", null);

    // I know I have to send the browser to http://localhost:3000/connect
    // but for some reason, the Location header takes me to the auth URL
    String location = getIntent().getStringExtra("Location");
    location = "http://localhost:3000/connect";

    mAuthWebView = (WebView)findViewById(R.id.webView);
    WebSettings webSettings = mAuthWebView.getSettings();
    webSettings.setJavaScriptEnabled(true);

    mAuthWebView.setWebViewClient(new WebViewClient(){
      @Override
      public void onPageFinished(WebView view, String url) {
        Log.d(TAG, "URL: " + url);
        if(url.startsWith("http://localhost:3000/token")) {
          Intent backToApp = new Intent(view.getContext(), ContosoMenuActivity.class);
          setResult(Activity.RESULT_OK, backToApp);
          finish();
          //startActivity(backToApp);
        }

        super.onPageFinished(view, url);
      }
    });

    Map<String, String> additionalHeaders = new HashMap<>();
    additionalHeaders.put("u-token", mContosoUserToken);
    mAuthWebView.loadUrl(location, additionalHeaders);
  }
}
