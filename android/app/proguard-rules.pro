# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.kts.

# Keep JavaScript interface methods
-keepclassmembers class com.hearloom.bridge.HearloomBridge {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep data classes used with JSON
-keep class com.hearloom.bridge.** { *; }
