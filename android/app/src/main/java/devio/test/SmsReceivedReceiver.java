package devio.test;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.telephony.SmsMessage;
import java.util.List;
import android.provider.Telephony;

import com.facebook.react.HeadlessJsTaskService;

public class SmsReceivedReceiver extends BroadcastReceiver {

    private static final String TAG = "SMSReceiver";

    @Override
    public void onReceive(final Context context, final Intent intent) {
        /**
         This part will be called every time network connection is changed
         e.g. Connected -> Not Connected
         **/
        if (!isAppOnForeground((context))) {
            if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {

                SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);

                for (SmsMessage message : messages) {
                    String messageBody = message.getMessageBody();

                    Intent serviceIntent = new Intent(context, ReadSmsTaskService.class);
                    serviceIntent.putExtra("message", messageBody);

                    context.startService(serviceIntent);
                    HeadlessJsTaskService.acquireWakeLockNow(context);
                }
            }
        }
    }

    private boolean isAppOnForeground(Context context) {
        /**
         We need to check if app is in foreground otherwise the app will crash.
         http://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses =
                activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance ==
                    ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }
}