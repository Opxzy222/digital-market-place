FROM thyrlian/android-sdk

# Create directories
RUN mkdir -p /usr/local/java /usr/local/android-sdk /usr/local/flutter

# Copy the Java JDK
COPY /mnt/c/Program\ Files/Eclipse\ Adoptium/jdk-21.0.4.7-hotspot /usr/local/java

# Copy the Android SDK
COPY /mnt/c/Users/HP/AppData/Local/Android/Sdk /usr/local/android-sdk

# Copy the Flutter SDK
COPY /mnt/c/Users/HP/Desktop/flutter/flutter /usr/local/flutter

# Set environment variables
ENV FLUTTER_ROOT=/usr/local/flutter
ENV FLUTTER_HOME=/usr/local/flutter
ENV PATH=$PATH:$FLUTTER_ROOT/bin
ENV PATH=$PATH:$FLUTTER_HOME/bin
ENV PATH=$PATH:$FLUTTER_ROOT/bin/cache/dart-sdk/bin
ENV ANDROID_HOME=/usr/local/android-sdk
ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
ENV PATH=$PATH:$ANDROID_HOME/emulator
ENV PATH=$PATH:$ANDROID_HOME/tools
ENV PATH=$PATH:$ANDROID_HOME/tools/bin
ENV PATH=$PATH:$ANDROID_HOME/platform-tools
ENV ANDROID_STUDIO_DIR=/opt/android-studio
ENV PATH=$PATH:/opt/android-studio/bin

# Expose necessary ports
EXPOSE 6080

# Default command
CMD ["/bin/bash"]


