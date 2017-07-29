function Convert() {
    var message = $("#input").val();
    var words = message.split(" ");

    var newwords = [];
    var message = 1;
    var currentmessage = "";
    var isalpha = /[a-z]/i;
    var isnumber = /[0-9]/;
    var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    var separator = "\t";
    if ($("#radio_newlines").is(":checked")) {
        separator = "\n";
    }

    $("#message_blocks").empty();
    $.each(words, function(wordi, word) {
        var newword = "";
        word = word.split("");
        for (var i = 0; i < word.length; i++) {
            var l = word[i].toLowerCase();
            if (l == "a") {
                if (i < word.length - 1 && word[i + 1] == "b") {
                    newword += ":ab: ";
                    i += 1;
                } else {
                    newword += ":a: ";
                }
            } else if (l == "b") {
                newword += ":b: ";
            } else if (l.match(isalpha)) {
                newword += ":regional_indicator_" + l + ": ";
            } else if (l.match(isnumber)) {
                if (l == "1" && i < word.length - 2 && word[i + 1] == "0" && word[i + 2] == "0") {
                    newword += ":100:";
                    i += 2;
                } else if (l == "1" && i < word.length - 1 && word[i + 1] == "0") {
                    newword += ":keycap_ten: ";
                    i += 1;
                } else {
                    newword += ":" + numbers[parseInt(l)] + ": ";
                }
            } else if (l == "?") {
                newword += ":question:";
            } else if (l == "!") {
                if (i < word.length - 1 && word[i + 1] == "?") {
                    newword += ":interrobang:";
                    i += 1;
                } else {
                    newword += ":exclamation:";
                }
            } else if (l == ".") {
                newword += ":radio_button:";
            } else if (l == "'") {
                newword += ":small_red_triangle_down:";
            } else {
                newword += l;
            }
        }
        if (currentmessage.length + newword.length > 2000) {
            OutputMessage(currentmessage, message);
            currentmessage = newword + separator;
            message += 1;
        } else {
            currentmessage += newword + separator;
        }
    });
    OutputMessage(currentmessage, message)
    console.log("Conversion complete");
}

function btnCopyClick() {
    $(this).tooltip({
        title: "Copied!",
        trigger: "manual"
    }).tooltip("show");
}

function btnCopyMouseLeave() {
    if ($(this).is("[aria-describedby]")) {
        $(this).tooltip('dispose');
    }
}

function OutputMessage(message, i) {
    var blockId = "message_block" + i.toString();
    var output = $("#message_block_template").clone().attr("id", blockId);
    output.find(".message-title").text("Message " + i.toString());
    output.find(".message-subtitle").text(message.length + " characters");
    output.find(".message").text(message).attr("id", "message" + i.toString());
    output.find("button").click(btnCopyClick).mouseleave(btnCopyMouseLeave);
    $("#message_blocks").append(output);

    //After content has been added
    new Clipboard("#" + blockId + " button", {
        text: function(trigger) {
            return message;
        }
    });
}
$(function() {
    $("#message_form").submit(function(e) {
        e.preventDefault();
        Convert();
    })
});
