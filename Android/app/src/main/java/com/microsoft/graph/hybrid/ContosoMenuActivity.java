package com.microsoft.graph.hybrid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Map;

public class ContosoMenuActivity extends AppCompatActivity {
  private final String TAG = "ContosoMenuActivity";
  private final int MICROSOFT_SIGN_IN_REQUEST_CODE = 123;
  private String mContosoUserToken;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_contoso_menu);

    mContosoUserToken = getSharedPreferences("ContosoConf", Context.MODE_PRIVATE).getString("ContosoUserToken", null);
  }

  public void onJournalClick(View v){
    getJournalData();
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if(requestCode == MICROSOFT_SIGN_IN_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
      getJournalData();
    }
  }

  public void getJournalData() {
    final RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
    String url ="http://localhost:3000/graph/getJournal";

    final StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
      new Response.Listener<String>() {
        @Override
        public void onResponse(String response) {
          Log.d("Response", response);
        }
      },
      new Response.ErrorListener() {
        @Override
        public void onErrorResponse(VolleyError error) {
          Log.d("ERROR","error => " + error.getMessage());
        }
      }
    ) {
      @Override
      public Map<String, String> getHeaders() throws AuthFailureError {
        Map<String,String> params = new HashMap<>();
        params.put("u-token", mContosoUserToken);
        return params;
      }

      @Override
      protected Response<String> parseNetworkResponse(NetworkResponse response) {
        Map<String, String> responseHeaders = response.headers;
        return super.parseNetworkResponse(response);
      }

      @Override
      public void deliverError(VolleyError error) {
        Log.d(TAG, "deliverError");

        // Handle code 302
        if(error.networkResponse.statusCode == HttpURLConnection.HTTP_MOVED_TEMP) {
          Log.d(TAG, "Location: " + error.networkResponse.headers.get("Location"));
          Intent microsoftSignInIntent = new Intent(ContosoMenuActivity.this, MicrosoftSignInActivity.class);
          microsoftSignInIntent.putExtra("Location", error.networkResponse.headers.get("Location"));
          startActivityForResult(microsoftSignInIntent, MICROSOFT_SIGN_IN_REQUEST_CODE);
        }
      }
    };

    queue.add(stringRequest);
  }
}
