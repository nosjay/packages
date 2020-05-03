package com.github.wjiec.stream;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.function.Predicate;
import java.util.stream.Stream;

public class AliceInWonderLand {

    public static Stream<String> words() {
        try {
            InputStream txt = AliceInWonderLand.class.getResourceAsStream("/aliceinwonderland.txt");
            String contents = new String(txt.readAllBytes(), StandardCharsets.UTF_8);

            return Arrays.stream(contents.split("\\PL+"));
        } catch (IOException ignored) {
            return Stream.empty();
        }
    }

    public static Stream<String> words(Predicate<String> p) {
        return words().filter(p);
    }

}
