var isalpha = /[a-z]/i;
var isnumber = /[0-9]/;
var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function Convert() {
    var message = $("#input").val();
    var words = message.split(" ");
    var convert = !$("#split_only").is(":checked");

    var newwords = [];
    var message = 1;
    var currentmessage = "";
    var character_limit = isNaN(parseInt($("#message_length").val())) ? 2000 : parseInt($("#message_length").val());

    var separator = "\t";
    if ($("#radio_newlines").is(":checked")) {
        separator = "\n";
    }
	if (convert) {
		separator = " ";
	}

    $("#message_blocks").empty();
    $.each(words, function(wordi, word) {
        var newword = "";
        if (convert) {
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
        } else {
            newword = word;
        }
        if (currentmessage.length + newword.length > character_limit) {
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
    $(".message-block button").text("Copy");
    $(this).text("Copied!").removeClass("btn-default").addClass("btn-success");

}

function changeConversionMode() {
    if ($("#split_only").is(":checked")) {
        $("#separator_options").hide();
        $("#convert").val("Split");
    } else {
        $("#separator_options").show();
        $("#convert").val("Convert");
    }
}

function OutputMessage(message, i) {
    var blockId = "message_block" + i.toString();
    var output = $("#message_block_template").clone().attr("id", blockId);
    output.find(".message-title").text("Message " + i.toString());
    output.find(".message-subtitle").text(message.length + " characters");
    output.find(".message").text(message).attr("id", "message" + i.toString());
    output.find("button").click(btnCopyClick);
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
    });
    $("#split_only").change(changeConversionMode);
});
